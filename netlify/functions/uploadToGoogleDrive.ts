// Netlify function to upload backup to Google Drive
import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event, context) => {
  process.env.NODE_ENV === "development" &&
    console.log("[uploadToGoogleDrive] Function invoked");

  // Check for authentication and request body
  if (!context.clientContext || !context.clientContext.user || !event.body) {
    process.env.NODE_ENV === "development" &&
      console.log(
        "[uploadToGoogleDrive] Unauthorized - Missing client context or body"
      );
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Only allow POST method
  if (event.httpMethod !== "POST") {
    process.env.NODE_ENV === "development" &&
      console.log(
        "[uploadToGoogleDrive] Method not allowed:",
        event.httpMethod
      );
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Connect to database
  await connectToDB();

  try {
    // Extract user email
    const { email }: { email: string } = context.clientContext.user;
    const { backupData, accessToken } = JSON.parse(event.body);

    if (!backupData || !accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing backupData or accessToken" }),
      };
    }

    process.env.NODE_ENV === "development" &&
      console.log(`[uploadToGoogleDrive] Uploading backup for user: ${email}`);

    // Find user data
    const userData = await UserData.findOne({ email, account: "active" });
    if (!userData) {
      process.env.NODE_ENV === "development" &&
        console.log(`[uploadToGoogleDrive] User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Upload to Google Drive with date-time format: backup-YYYY-MM-DD_HH-MM-SS.json
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const fileName = `backup-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.json`;
    const fileContent = JSON.stringify(backupData);

    try {
      const uploadResponse = await uploadFileToGoogleDrive(
        fileName,
        fileContent,
        accessToken
      );

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message);
      }

      process.env.NODE_ENV === "development" &&
        console.log(
          `[uploadToGoogleDrive] File uploaded successfully: ${uploadResponse.fileId}`
        );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Backup uploaded to Google Drive successfully",
          fileId: uploadResponse.fileId,
          fileName: uploadResponse.fileName,
        }),
      };
    } catch (driveError) {
      console.error("[uploadToGoogleDrive] Google Drive error:", driveError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to upload to Google Drive",
          error:
            driveError instanceof Error ? driveError.message : "Unknown error",
        }),
      };
    }
  } catch (error) {
    console.error("[uploadToGoogleDrive] Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function findOrCreateFolder(
  folderName: string,
  accessToken: string
): Promise<string | null> {
  try {
    // Search for existing folder
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!searchResponse.ok) {
      console.error("Failed to search for folder");
      return null;
    }

    const searchData = await searchResponse.json();

    // If folder exists, return its ID
    if (searchData.files && searchData.files.length > 0) {
      process.env.NODE_ENV === "development" &&
        console.log(
          `[uploadToGoogleDrive] Found existing folder: ${searchData.files[0].id}`
        );
      return searchData.files[0].id;
    }

    // Create new folder
    const createResponse = await fetch(
      "https://www.googleapis.com/drive/v3/files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
        }),
      }
    );

    if (!createResponse.ok) {
      console.error("Failed to create folder");
      return null;
    }

    const createData = await createResponse.json();
    process.env.NODE_ENV === "development" &&
      console.log(`[uploadToGoogleDrive] Created new folder: ${createData.id}`);
    return createData.id;
  } catch (error) {
    console.error("Error finding/creating folder:", error);
    return null;
  }
}

async function uploadFileToGoogleDrive(
  fileName: string,
  fileContent: string,
  accessToken: string
): Promise<{
  success: boolean;
  fileId?: string;
  fileName?: string;
  message: string;
}> {
  try {
    // Find or create the backup folder
    const folderId = await findOrCreateFolder("to-do-list-backup", accessToken);

    // Create file metadata
    const fileMetadata: any = {
      name: fileName,
      mimeType: "application/json",
    };

    // If folder was found/created, add it as parent
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    // Create multipart request body
    const boundary = "===============7330845974216740156==";
    const multipartBody =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(fileMetadata) +
      `\r\n--${boundary}\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      fileContent +
      `\r\n--${boundary}--`;

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary="${boundary}"`,
        },
        body: multipartBody,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.error?.message || "Failed to upload file",
      };
    }

    const data = await response.json();
    return {
      success: true,
      fileId: data.id,
      fileName: data.name,
      message: "File uploaded successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export { handler };
