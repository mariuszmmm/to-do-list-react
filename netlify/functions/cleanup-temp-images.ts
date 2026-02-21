import { Handler } from "@netlify/functions";
import { jsonResponse } from "./lib/response";

const handler: Handler = async (event) => {
  const logPrefix = "[cleanup-temp-images]";
  console.log(`${logPrefix} Function started. Method: ${event.httpMethod}`);

  if (event.httpMethod !== "POST") {
    console.warn(`${logPrefix} Method ${event.httpMethod} not allowed.`);
    return jsonResponse(405, { message: "Method not allowed" });
  }

  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    return jsonResponse(500, { message: "Missing Cloudinary configuration" });
  }

  try {
    const ASSET_FOLDER = "Todo-list/temp_uploads";

    // Calculate threshold
    const now = new Date();
    // const threshold = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours
    const threshold = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour - TEST

    const thresholdISO = threshold.toISOString().split(".")[0] + "Z";

    console.log(`${logPrefix} Folder: ${ASSET_FOLDER}`);
    console.log(`${logPrefix} Threshold: ${thresholdISO}`);

    const basicAuth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString(
      "base64",
    );

    const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
    const searchResponse = await fetch(searchUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: `folder:${ASSET_FOLDER} AND created_at < "${thresholdISO}"`,
      }),
    });

    const searchData = (await searchResponse.json()) as any;
    const resourcesFound = searchData.resources?.length || 0;
    console.log(`${logPrefix} Resources found to delete: ${resourcesFound}`);

    if (!searchData.resources || searchData.resources.length === 0) {
      return jsonResponse(200, {
        message: "No resources found in folder",
        data: { cleaned: 0 },
      });
    }

    const publicIds = searchData.resources.map((r: any) => r.public_id);
    console.log(`${logPrefix} Deleting IDs: ${publicIds.join(", ")}`);

    const deleteUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;

    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_ids: publicIds,
      }),
    });

    const deleteData = (await deleteResponse.json()) as any;

    if (deleteResponse.ok) {
      const deletedCount = Object.keys(deleteData.deleted || {}).length;
      console.log(
        `${logPrefix} Successfully deleted ${deletedCount} resources.`,
      );

      return jsonResponse(200, {
        message: "Cleanup completed",
        data: { cleaned: deletedCount },
      });
    } else {
      return jsonResponse(400, {
        message: "Failed to delete resources",
        error: deleteData,
      });
    }
  } catch (error) {
    console.error(`${logPrefix} Cleanup error:`, error);
    return jsonResponse(500, {
      message: "Failed to cleanup Cloudinary",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { handler };
