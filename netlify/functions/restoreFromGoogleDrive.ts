// Netlify function to restore user data from Google Drive backup
import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";
import { publishAblyUpdate } from "./config/ably";

const handler: Handler = async (event, context) => {
  process.env.NODE_ENV === "development" &&
    console.log("[restoreFromGoogleDrive] Function invoked");

  // Check for authentication and request body
  if (!context.clientContext || !context.clientContext.user || !event.body) {
    process.env.NODE_ENV === "development" &&
      console.log(
        "[restoreFromGoogleDrive] Unauthorized - Missing client context or body"
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
        "[restoreFromGoogleDrive] Method not allowed:",
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
    const { fileId, accessToken } = JSON.parse(event.body);

    if (!fileId || !accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileId or accessToken" }),
      };
    }

    process.env.NODE_ENV === "development" &&
      console.log(
        `[restoreFromGoogleDrive] Restoring backup for user: ${email}`
      );

    // Find user data
    const userData = await UserData.findOne({ email, account: "active" });
    if (!userData) {
      process.env.NODE_ENV === "development" &&
        console.log(`[restoreFromGoogleDrive] User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Download file from Google Drive
    try {
      const backupData = await downloadFileFromGoogleDrive(fileId, accessToken);

      if (!backupData) {
        throw new Error("Failed to download backup file");
      }

      process.env.NODE_ENV === "development" &&
        console.log(
          `[restoreFromGoogleDrive] Backup structure:`,
          JSON.stringify(backupData).substring(0, 200)
        );

      // Handle both old format (single user) and new format (multiple users)
      let listsToRestore;

      if (
        backupData.backupType === "admin-full-backup" &&
        Array.isArray(backupData.users)
      ) {
        // New format: find current user's data
        const userBackup = backupData.users.find((u: any) => u.email === email);
        if (!userBackup) {
          throw new Error("User data not found in backup");
        }
        listsToRestore = userBackup.lists;
        process.env.NODE_ENV === "development" &&
          console.log(
            `[restoreFromGoogleDrive] Found user ${email} in multi-user backup`
          );
      } else if (Array.isArray(backupData.lists)) {
        // Old format: direct lists array
        listsToRestore = backupData.lists;
        process.env.NODE_ENV === "development" &&
          console.log(
            `[restoreFromGoogleDrive] Using single-user backup format`
          );
      } else {
        throw new Error("Invalid backup format: unrecognized structure");
      }

      if (!Array.isArray(listsToRestore)) {
        throw new Error("Invalid backup format: lists must be an array");
      }

      // Add missing required fields to lists
      const currentDate = new Date().toISOString();
      const normalizedLists = listsToRestore.map((list: any) => ({
        ...list,
        date: list.date || currentDate,
        updatedAt: list.updatedAt || currentDate,
      }));

      // Update user data with backup
      userData.lists = normalizedLists;
      await userData.save();

      process.env.NODE_ENV === "development" &&
        console.log(
          `[restoreFromGoogleDrive] Backup restored successfully for: ${email}, lists: ${normalizedLists.length}`
        );

      // Publish update via Ably
      await publishAblyUpdate(email, {
        action: "restore",
        timestamp: new Date().toISOString(),
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Backup restored successfully",
          listsCount: normalizedLists.length,
        }),
      };
    } catch (driveError) {
      console.error("[restoreFromGoogleDrive] Google Drive error:", driveError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to restore from Google Drive",
          error:
            driveError instanceof Error ? driveError.message : "Unknown error",
        }),
      };
    }
  } catch (error) {
    console.error("[restoreFromGoogleDrive] Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function downloadFileFromGoogleDrive(
  fileId: string,
  accessToken: string
): Promise<any> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Failed to download file: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export { handler };
