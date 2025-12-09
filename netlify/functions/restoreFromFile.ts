// Netlify function to restore user data from local file backup
import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";
import { publishAblyUpdate } from "./config/ably";

const handler: Handler = async (event, context) => {
  console.log("[restoreFromFile] Function invoked");

  // Check for authentication and request body
  if (!context.clientContext || !context.clientContext.user || !event.body) {
    console.log(
      "[restoreFromFile] Unauthorized - Missing client context or body"
    );
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Only allow POST method
  if (event.httpMethod !== "POST") {
    console.log("[restoreFromFile] Method not allowed:", event.httpMethod);
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
    const { backupData } = JSON.parse(event.body);

    if (!backupData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing backupData" }),
      };
    }

    console.log(`[restoreFromFile] Restoring backup for user: ${email}`);

    // Find user data
    const userData = await UserData.findOne({ email, account: "active" });
    if (!userData) {
      console.log(`[restoreFromFile] User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    try {
      console.log(
        `[restoreFromFile] Backup structure:`,
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
        console.log(
          `[restoreFromFile] Found user ${email} in multi-user backup`
        );
      } else if (Array.isArray(backupData.lists)) {
        // Old format: direct lists array
        listsToRestore = backupData.lists;
        console.log(`[restoreFromFile] Using single-user backup format`);
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

      console.log(
        `[restoreFromFile] Backup restored successfully for: ${email}, lists: ${normalizedLists.length}`
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
    } catch (restoreError) {
      console.error("[restoreFromFile] Restore error:", restoreError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to restore from file",
          error:
            restoreError instanceof Error
              ? restoreError.message
              : "Unknown error",
        }),
      };
    }
  } catch (error) {
    console.error("[restoreFromFile] Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export { handler };
