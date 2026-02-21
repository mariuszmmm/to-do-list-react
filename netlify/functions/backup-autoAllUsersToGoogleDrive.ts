import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { getAllUsersForBackup } from "../functions/lib/getAllUsersForBackup";
import { uploadBackupToGoogleDrive } from "../functions/lib/uploadBackupToGoogleDrive";
import { findOrCreateFolder } from "../functions/lib/findOrCreateFolder";
import { jsonResponse, logError } from "../functions/lib/response";
import {
  getGoogleAccessToken,
  listFilesID,
  deleteFile,
} from "../functions/lib/googleDriveHelper";

const handler: Handler = async (event) => {
  const logPrefix = "[autoBackupToGoogleDrive]";
  console.log(`${logPrefix} Function started.`);

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { message: "Method not allowed" });
  }

  // Security check: verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = event.headers["x-cron-secret"];

  if (!cronSecret || providedSecret !== cronSecret) {
    console.warn(`${logPrefix} Unauthorized access attempt.`);
    return jsonResponse(401, { message: "Unauthorized" });
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_BACKUP_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error(`${logPrefix} Missing Google Drive configuration.`);
    return jsonResponse(500, { message: "Missing Google Drive configuration" });
  }

  try {
    await connectToDB();

    // 1. Refresh Access Token
    console.log(`${logPrefix} Refreshing Google access token...`);
    const accessToken = await getGoogleAccessToken(
      clientId,
      clientSecret,
      refreshToken,
    );
    if (!accessToken) {
      return jsonResponse(401, {
        message: "Failed to refresh Google access token",
      });
    }

    // 2. Prepare Backup Data
    console.log(`${logPrefix} Preparing backup data...`);
    const { backupData, fileName } = await getAllUsersForBackup(
      "system-automated-backup",
    );
    const fileContent = JSON.stringify(backupData);
    const folderName = "To-do-list/AutoBackups";

    // 3. Upload Backup
    console.log(`${logPrefix} Uploading backup to Google Drive...`);
    const uploadResponse = await uploadBackupToGoogleDrive(
      folderName,
      fileName,
      fileContent,
      accessToken,
    );

    if (!uploadResponse.success) {
      throw new Error(`Upload failed: ${uploadResponse.message}`);
    }

    console.log(`${logPrefix} Backup uploaded successfully: ${fileName}`);

    // 4. Cleanup old backups (older than 3 days)
    console.log(`${logPrefix} Cleaning up old backups...`);
    const folderId = await findOrCreateFolder(folderName, accessToken);
    if (folderId) {
      const files = await listFilesID(folderId, accessToken);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      let deletedCount = 0;
      for (const file of files) {
        const fileCreatedTime = new Date(file.createdTime);
        if (fileCreatedTime < threeDaysAgo) {
          console.log(
            `${logPrefix} Deleting old backup: ${file.name} (${file.id})`,
          );
          const deleted = await deleteFile(file.id, accessToken);
          if (deleted) deletedCount++;
        }
      }
      console.log(
        `${logPrefix} Cleanup completed. Deleted ${deletedCount} old backups.`,
      );
    }

    return jsonResponse(200, {
      message: "Automated backup completed successfully",
      fileName,
      cleanedOldBackups: true,
    });
  } catch (error) {
    logError("Error in automated backup", error, logPrefix);
    return jsonResponse(500, {
      message: "Internal server error during automated backup",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { handler };
