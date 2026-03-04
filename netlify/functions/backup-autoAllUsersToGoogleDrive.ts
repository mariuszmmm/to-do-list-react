import SystemConfig from "../models/SystemConfig";
import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { getAllUsersForBackup } from "../functions/lib/getAllUsersForBackup";
import { uploadBackupToGoogleDrive } from "../functions/lib/uploadBackupToGoogleDrive";
import { findOrCreateFolder } from "../functions/lib/findOrCreateFolder";
import { jsonResponse, logError } from "../functions/lib/response";
import { publishSystemLog } from "../functions/lib/ablyHelper";
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

  const updateStatus = async (
    status: "success" | "error",
    details?: string,
  ) => {
    try {
      await connectToDB();
      const timestamp = new Date().toISOString();
      const value = { status, details, timestamp };

      // Update the persistent latest status for UI health indicators
      await SystemConfig.findOneAndUpdate(
        { key: "lastAutoBackupStatus" },
        { value, updatedAt: new Date() },
        { upsert: true },
      );

      // Add a unique log entry for the history list
      await SystemConfig.create({
        key: `log_autobackup_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });

      // Notify admins in real-time
      await publishSystemLog({
        key: "log_autobackup",
        status,
        details,
        timestamp,
      });
    } catch (err) {
      console.error(`${logPrefix} Failed to update SystemConfig:`, err);
    }
  };

  try {
    // Security check: verify cron secret
    const cronSecret = process.env.CRON_SECRET;
    const providedSecret = event.headers["x-cron-secret"];

    if (!cronSecret || providedSecret !== cronSecret) {
      console.warn(`${logPrefix} Unauthorized access attempt.`);
      await updateStatus("error", "Unauthorized access attempt to auto-backup");
      return jsonResponse(401, { message: "Unauthorized" });
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.replace(/"/g, "");
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.replace(
      /"/g,
      "",
    );
    const refreshToken = process.env.GOOGLE_BACKUP_REFRESH_TOKEN?.replace(
      /"/g,
      "",
    );

    if (!clientId || !clientSecret || !refreshToken) {
      console.error(`${logPrefix} Missing Google Drive configuration.`);
      await updateStatus("error", "Missing Google Drive configuration");
      return jsonResponse(500, {
        message: "Missing Google Drive configuration",
      });
    }

    await connectToDB();

    // 1. Refresh Access Token
    console.log(`${logPrefix} Refreshing Google access token...`);
    const accessToken = await getGoogleAccessToken(
      clientId,
      clientSecret,
      refreshToken,
    );
    if (!accessToken) {
      await updateStatus("error", "Google Drive authentication failed (401)");
      return jsonResponse(401, {
        message: "Failed to refresh Google access token",
      });
    }

    // 2. Prepare Backup Data
    console.log(`${logPrefix} Preparing backup data...`);
    const { backupData, fileName } = await getAllUsersForBackup(
      "system-automated-backup",
    );

    const fileNameWithPrefix = `AutoBackup_${fileName}`;
    const fileContent = JSON.stringify(backupData);
    const folderName = "To-do-list_Backups";

    // 3. Upload Backup
    console.log(`${logPrefix} Uploading backup to Google Drive...`);
    const uploadResponse = await uploadBackupToGoogleDrive(
      fileNameWithPrefix,
      fileContent,
      accessToken,
    );

    if (!uploadResponse.success) {
      await updateStatus("error", uploadResponse.message);
      throw new Error(`Upload failed: ${uploadResponse.message}`);
    }

    console.log(
      `${logPrefix} Backup uploaded successfully: ${fileNameWithPrefix}`,
    );

    // 4. Cleanup old backups (older than 10 days)
    console.log(`${logPrefix} Cleaning up old backups...`);
    const folderId = await findOrCreateFolder(folderName, accessToken);
    if (folderId) {
      const files = await listFilesID(folderId, accessToken);
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      let deletedCount = 0;
      for (const file of files) {
        const fileCreatedTime = new Date(file.createdTime);
        if (fileCreatedTime < tenDaysAgo) {
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

    await updateStatus(
      "success",
      `Automated backup completed successfully: ${fileNameWithPrefix}`,
    );

    return jsonResponse(200, {
      message: "Automated backup completed successfully",
      fileName: fileNameWithPrefix,
      cleanedOldBackups: true,
    });
  } catch (error) {
    logError("Error in automated backup", error, logPrefix);
    await updateStatus(
      "error",
      error instanceof Error ? error.message : "Unknown error",
    );
    return jsonResponse(500, {
      message: "Internal server error during automated backup",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { handler };
