import { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";

const handler: Handler = async (event) => {
  const logPrefix = "[cleanup-orphan-images]";

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Cloudinary configuration" }),
    };
  }

  try {
    const ASSET_FOLDER = "Todo-list";
    const GRACE_PERIOD_DAYS = 7; // Only delete images older than 7 days

    console.log(`${logPrefix} Starting orphan images cleanup...`);

    // Calculate threshold: images older than 7 days
    const now = new Date();
    const threshold = new Date(now.getTime() - GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
    const thresholdISO = threshold.toISOString().split(".")[0] + "Z";

    const basicAuth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

    // 1. Fetch all images from Cloudinary in Todo-list folder (older than grace period)
    console.log(`${logPrefix} Fetching images from Cloudinary...`);
    const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;

    let allCloudinaryImages: any[] = [];
    let nextCursor: string | null = null;

    // Paginate through all Cloudinary results
    do {
      const searchBody: any = {
        expression: `folder:${ASSET_FOLDER}/* AND created_at<${thresholdISO}`,
        max_results: 100,
        with_field: ["context", "tags"], // Include context and tags in response
      };

      if (nextCursor) {
        searchBody.next_cursor = nextCursor;
      }

      const searchResponse = await fetch(searchUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchBody),
      });

      const searchData = (await searchResponse.json()) as any;

      if (searchData.resources && searchData.resources.length > 0) {
        allCloudinaryImages = allCloudinaryImages.concat(searchData.resources);
      }

      nextCursor = searchData.next_cursor || null;
    } while (nextCursor);

    console.log(
      `${logPrefix} Found ${allCloudinaryImages.length} images in Cloudinary (all ages - grace period disabled for testing)`,
    );

    // Log detailed info about all found images
    if (allCloudinaryImages.length > 0) {
      console.log(`${logPrefix} Detailed image list:`);
      allCloudinaryImages.forEach((resource, index) => {
        // First, try to get info from context/metadata
        const context = resource.context ? resource.context : {};
        let userName = context.userEmail?.split("@")[0] || "unknown";
        let listName = context.listName || "unknown";
        let taskId = context.taskId || "unknown";
        let userEmail = context.userEmail || "unknown";

        // Fallback: parse public_id if metadata is missing
        if (!context.userEmail) {
          const pathParts = resource.public_id.split("/");
          if (pathParts.length >= 4) {
            userName = pathParts[1];
            listName = pathParts[2];
          } else if (pathParts.length === 3 && pathParts[1] !== "temp_uploads") {
            userName = pathParts[1];
          }
        }

        const imageName = resource.filename || resource.public_id.split("/").pop() || "unknown";
        const sizeKB = (resource.bytes / 1024).toFixed(2);
        const format = resource.format || "unknown";
        const tags = resource.tags && resource.tags.length > 0 ? resource.tags.join(", ") : "no tags";
        const listId = context.listId || "no listId";

        console.log(
          `${logPrefix}   [${index + 1}] User: ${userName} | List: ${listName} | Image: ${imageName} | Size: ${sizeKB} KB`,
        );
        console.log(`${logPrefix}       Tags: [${tags}] | listId: ${listId} | taskId: ${taskId} | Email: ${userEmail}`);
        console.log(`${logPrefix}       public_id: ${resource.public_id}`);
      });
    }

    if (allCloudinaryImages.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No images found in Cloudinary",
          cleaned: 0,
        }),
      };
    }

    // 2. Fetch all public_ids from MongoDB
    console.log(`${logPrefix} Fetching public_ids from MongoDB...`);
    await connectToDB();

    const allUsers = await UserData.find({ account: "active" }).exec();
    const mongoPublicIds = new Set<string>();
    const mongoImagesMap = new Map<
      string,
      {
        publicId: string;
        userEmail: string;
        userName: string;
        listId: string;
        listName: string;
        image: {
          imageUrl: string | null;
          publicId: string | null;
          format: string | null;
          createdAt: string | null;
          displayName: string | null;
          height: number | null;
          width: number | null;
          originalFilename: string | null;
        } | null;
      }
    >();

    for (const user of allUsers) {
      const userEmail = user.email;
      const userName = userEmail.split("@")[0] || "unknown";

      for (const list of user.lists) {
        const listId = list.id;
        const listName = list.name;

        // Check taskList
        for (const task of list.taskList) {
          if (task.image?.publicId) {
            const publicId = task.image.publicId;
            mongoPublicIds.add(publicId);
            if (!mongoImagesMap.has(publicId)) {
              mongoImagesMap.set(publicId, {
                publicId,
                userEmail,
                userName,
                listId,
                listName,
                image: {
                  imageUrl: task.image.imageUrl ?? null,
                  publicId: task.image.publicId ?? null,
                  format: task.image.format ?? null,
                  createdAt: task.image.createdAt ?? null,
                  displayName: task.image.displayName ?? null,
                  height: task.image.height ?? null,
                  width: task.image.width ?? null,
                  originalFilename: task.image.originalFilename ?? null,
                },
              });
            }
          }
        }
        // Check deletedTasks (for undo functionality)
        for (const task of list.deletedTasks || []) {
          if (task.image?.publicId) {
            const publicId = task.image.publicId;
            mongoPublicIds.add(publicId);
            if (!mongoImagesMap.has(publicId)) {
              mongoImagesMap.set(publicId, {
                publicId,
                userEmail,
                userName,
                listId,
                listName,
                image: {
                  imageUrl: task.image.imageUrl ?? null,
                  publicId: task.image.publicId ?? null,
                  format: task.image.format ?? null,
                  createdAt: task.image.createdAt ?? null,
                  displayName: task.image.displayName ?? null,
                  height: task.image.height ?? null,
                  width: task.image.width ?? null,
                  originalFilename: task.image.originalFilename ?? null,
                },
              });
            }
          }
        }
      }
    }

    console.log(`${logPrefix} Found ${mongoPublicIds.size} public_ids in MongoDB`);

    if (mongoImagesMap.size > 0) {
      console.log(`${logPrefix} MongoDB images (unique):`);
      Array.from(mongoImagesMap.values()).forEach((entry, index) => {
        console.log(
          `${logPrefix}   [${index + 1}] User: ${entry.userName} | Email: ${entry.userEmail} | List: ${entry.listName} | ListId: ${entry.listId}`,
        );
        console.log(`${logPrefix}       publicId: ${entry.publicId}`);
        console.log(`${logPrefix}       imageUrl: ${entry.image?.imageUrl ?? null}`);
      });
    }

    // 3. Find orphan images (in Cloudinary but not in MongoDB)
    const orphanImages = allCloudinaryImages.filter((resource) => {
      // Skip temp_uploads folder (handled by separate cleanup)
      if (resource.public_id.includes("/temp_uploads/")) {
        return false;
      }
      return !mongoPublicIds.has(resource.public_id);
    });

    console.log(`${logPrefix} Found ${orphanImages.length} orphan images to delete`);

    // Log detailed info about orphan images that will be deleted
    if (orphanImages.length > 0) {
      console.log(`${logPrefix} Orphan images to be deleted:`);
      orphanImages.forEach((resource, index) => {
        // First, try to get info from context/metadata
        const context = resource.context ? resource.context : {};
        let userName = context.userEmail?.split("@")[0] || "unknown";
        let listName = context.listName || "unknown";
        let taskId = context.taskId || "unknown";
        let userEmail = context.userEmail || "unknown";

        // Fallback: parse public_id if metadata is missing
        if (!context.userEmail) {
          const pathParts = resource.public_id.split("/");
          if (pathParts.length >= 4) {
            userName = pathParts[1];
            listName = pathParts[2];
          } else if (pathParts.length === 3 && pathParts[1] !== "temp_uploads") {
            userName = pathParts[1];
          }
        }

        const imageName = resource.filename || resource.public_id.split("/").pop() || "unknown";
        const sizeKB = (resource.bytes / 1024).toFixed(2);
        const format = resource.format || "unknown";
        const tags = resource.tags && resource.tags.length > 0 ? resource.tags.join(", ") : "no tags";
        const listId = context.listId || "no listId";

        console.log(
          `${logPrefix}   ❌ [${index + 1}] User: ${userName} | List: ${listName} | Image: ${imageName} | Size: ${sizeKB} KB`,
        );
        console.log(`${logPrefix}       Tags: [${tags}] | listId: ${listId} | taskId: ${taskId} | Email: ${userEmail}`);
      });

      const totalSizeKB = orphanImages.reduce((sum, r) => sum + (r.bytes || 0), 0) / 1024;
      console.log(
        `${logPrefix} Total size to be freed: ${totalSizeKB.toFixed(2)} KB (${(totalSizeKB / 1024).toFixed(2)} MB)`,
      );
    }

    if (orphanImages.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No orphan images found",
          totalCloudinaryImages: allCloudinaryImages.length,
          totalMongoImages: mongoPublicIds.size,
          cleaned: 0,
          cloudinaryImages: allCloudinaryImages.map((resource) => {
            const context = resource.context ? resource.context : {};
            const userEmail = context.userEmail || "unknown";
            let listName = context.listName || "unknown";

            if (!context.userEmail) {
              const pathParts = resource.public_id.split("/");
              if (pathParts.length >= 4) {
                listName = pathParts[2] || listName;
              }
            }

            return {
              userEmail,
              listName,
              publicId: resource.public_id,
            };
          }),
          mongoImages: Array.from(mongoImagesMap.values()).map((entry) => ({
            userEmail: entry.userEmail,
            listName: entry.listName,
            publicId: entry.publicId,
            imageUrl: entry.image?.imageUrl ?? null,
          })),
        }),
      };
    }

    // 4. Delete orphan images in batches of 10
    const publicIdsToDelete = orphanImages.map((resource) => resource.public_id);
    console.log(`${logPrefix} Public IDs to delete:`, publicIdsToDelete);

    let totalDeleted = 0;
    const deleteUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;

    // Process in batches of 100 for Cloudinary API
    for (let i = 0; i < publicIdsToDelete.length; i += 100) {
      const batch = publicIdsToDelete.slice(i, i + 100);

      const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_ids: batch,
        }),
      });

      const deleteData = (await deleteResponse.json()) as any;

      if (deleteResponse.ok) {
        const deletedCount = Object.keys(deleteData.deleted || {}).length;
        totalDeleted += deletedCount;
        console.log(`${logPrefix} Deleted batch of ${deletedCount} images`);
      } else {
        console.warn(`${logPrefix} Failed to delete batch:`, deleteData);
      }
    }

    console.log(`${logPrefix} Cleanup completed. Total deleted: ${totalDeleted}`);

    // 5. Clean up empty folders in Todo-list
    try {
      console.log(`${logPrefix} Checking for empty folders in Todo-list...`);
      // Get all folders in Todo-list
      const foldersUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${ASSET_FOLDER}`;
      const foldersResponse = await fetch(foldersUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      });
      const foldersData = await foldersResponse.json();
      const folders = foldersData.folders || [];

      let emptyFolders: string[] = [];
      for (const folderObj of folders) {
        const folderPath = folderObj.path;
        // Check if folder has any images
        const searchFolderUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
        const searchFolderBody = {
          expression: `folder:${folderPath}/*`,
          max_results: 1,
        };
        const searchFolderResp = await fetch(searchFolderUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchFolderBody),
        });
        const searchFolderData = await searchFolderResp.json();
        const hasImages = searchFolderData.resources && searchFolderData.resources.length > 0;
        if (!hasImages) {
          emptyFolders.push(folderPath);
        }
      }

      // Delete empty folders
      for (const emptyFolder of emptyFolders) {
        const deleteFolderUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${emptyFolder}`;
        const deleteFolderResp = await fetch(deleteFolderUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${basicAuth}`,
          },
        });
        if (deleteFolderResp.ok) {
          console.log(`${logPrefix} Deleted empty folder: ${emptyFolder}`);
        } else {
          console.warn(`${logPrefix} Failed to delete folder: ${emptyFolder}`);
        }
      }
      console.log(`${logPrefix} Empty folders cleanup completed. Deleted: ${emptyFolders.length}`);
    } catch (folderErr) {
      console.warn(`${logPrefix} Error during empty folders cleanup:`, folderErr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Orphan cleanup completed",
        totalCloudinaryImages: allCloudinaryImages.length,
        totalMongoImages: mongoPublicIds.size,
        orphansFound: orphanImages.length,
        cleaned: totalDeleted,
        gracePeriodDays: GRACE_PERIOD_DAYS,
        cloudinaryImages: allCloudinaryImages.map((resource) => {
          const context = resource.context ? resource.context : {};
          const userEmail = context.userEmail || "unknown";
          let listName = context.listName || "unknown";

          if (!context.userEmail) {
            const pathParts = resource.public_id.split("/");
            if (pathParts.length >= 4) {
              listName = pathParts[2] || listName;
            }
          }

          return {
            userEmail,
            listName,
            publicId: resource.public_id,
          };
        }),
        mongoImages: Array.from(mongoImagesMap.values()).map((entry) => ({
          userEmail: entry.userEmail,
          listName: entry.listName,
          publicId: entry.publicId,
          imageUrl: entry.image?.imageUrl ?? null,
        })),
      }),
    };
  } catch (error) {
    console.error(`${logPrefix} Cleanup error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to cleanup orphan images",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
