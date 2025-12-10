// Netlify function to add or update a single list for a user
import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { Data } from "../../src/types";
import { connectToDB } from "./config/mongoose";
import { publishAblyUpdate } from "./config/ably";

const handler: Handler = async (event, context) => {
  // Entry log
  process.env.NODE_ENV === "development" &&
    console.log("[addData] Function invoked");

  // Connect to database
  await connectToDB();

  // Only allow PUT method
  if (event.httpMethod !== "PUT") {
    process.env.NODE_ENV === "development" &&
      console.log("[addData] Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Check for authentication and request body
  if (!context.clientContext || !context.clientContext.user || !event.body) {
    process.env.NODE_ENV === "development" &&
      console.log("[addData] Unauthorized - Missing client context or body");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Extract user email
  const { email }: { email: string } = context.clientContext.user;
  // process.env.NODE_ENV === "development" && console.log("User email:", email);

  try {
    // Find user in DB
    const foundUser = (await UserData.findOne({
      email,
      account: "active",
    })) as UserDoc | null;
    if (!foundUser) {
      process.env.NODE_ENV === "development" &&
        console.log("[addData] User not found:", email);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    // process.env.NODE_ENV === "development" && console.log("User found:", email, "Lists count:", foundUser.lists.length);

    // Parse request data
    let data: Data;
    try {
      data = JSON.parse(event.body);
    } catch (parseError) {
      const err = parseError as Error;
      console.error("JSON parse error:", err);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid JSON in request body",
          error: err.message,
        }),
      };
    }
    // process.env.NODE_ENV === "development" && console.log("Request data:", data);

    // Validate list in request
    if (!data.list || typeof data.list !== "object") {
      process.env.NODE_ENV === "development" &&
        console.log("[addData] No valid list provided in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "No list provided or invalid list structure",
        }),
      };
    }
    if (
      !data.list.id ||
      !data.list.taskList ||
      !Array.isArray(data.list.taskList)
    ) {
      process.env.NODE_ENV === "development" &&
        console.log("[addData] List missing required fields");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "List missing required fields (id, taskList)",
        }),
      };
    }
    // process.env.NODE_ENV === "development" && console.log("List ID:", data.list.id);

    // Find if list exists
    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.list?.id
    );

    let deletedTasksIds: string[] = [];
    if (listIndex !== -1) {
      // Update existing list
      // process.env.NODE_ENV === "development" && console.log("Updating existing list:", listIndex);
      const incomingList = data.list;
      const existingList = foundUser.lists[listIndex];

      // Check for version conflict
      if (incomingList.version !== existingList.version) {
        process.env.NODE_ENV === "development" &&
          console.log(
            "[addData] Version mismatch detected for list ID:",
            data.list.id
          );
        return {
          statusCode: 409,
          body: JSON.stringify({
            message: "Conflict detected: Version mismatch.",
            data: {
              // email: foundUser.email,
              lists: foundUser.lists,
              conflict: true,
            },
          }),
        };
      }

      deletedTasksIds = incomingList.taskList
        .filter((task) => task.deleted)
        .map((task) => task.id);

      // Update list fields
      existingList.date = incomingList.date;
      existingList.name = incomingList.name;
      existingList.updatedAt = incomingList.updatedAt;
      existingList.taskList = incomingList.taskList.filter(
        (task) => !deletedTasksIds.includes(task.id)
      );
      existingList.version = (existingList.version || 0) + 1;
    } else {
      // Add new list
      process.env.NODE_ENV === "development" &&
        console.log("[addData] Adding new list");
      const newList = {
        ...data.list,
        version: 0,
      };
      foundUser.lists.push(newList);
    }

    // Save user data
    let savedUser;
    try {
      savedUser = await foundUser.save();
    } catch (dbError) {
      const err = dbError as Error;
      console.error("[addData] Database save error:", err);
      if ((err as any).name === "VersionError") {
        return {
          statusCode: 409,
          body: JSON.stringify({
            message: "Conflict detected: Version mismatch during save.",
            error: err.message,
            stack: err.stack,
            data: {
              // email: foundUser.email,
              lists: foundUser.lists,
              conflict: true,
            },
          }),
        };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Database error during save",
          error: err.message,
        }),
      };
    }
    if (!savedUser) {
      console.error("[addData] Save operation failed for user:", email);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save data." }),
      };
    }
    process.env.NODE_ENV === "development" &&
      console.log("[addData] Data updated successfully for user:", email);

    // Publish update via Ably
    try {
      await publishAblyUpdate(email, {
        lists: savedUser.lists,
        deviceId: data.deviceId,
        ...(deletedTasksIds.length ? { deletedTasksIds } : {}),
      });
      process.env.NODE_ENV === "development" &&
        console.log("[addData] Ably notification sent successfully");
    } catch (ablyError) {
      console.error("[addData] Ably publish error:", ablyError);
    }

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data updated successfully",
        data: {
          lists: savedUser.lists,
          deviceId: data.deviceId,
          ...(deletedTasksIds.length ? { deletedTasksIds } : {}),
        },
      }),
    };
  } catch (error) {
    // Error response
    const err = error as Error;
    console.error("[addData] Error processing request:", err);
    // Obsługa VersionError z Mongoose
    if ((err as any).name === "VersionError") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Conflict detected: Version mismatch during save.",
          error: err.message,
          stack: err.stack,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: err.message,
        stack: err.stack,
      }),
    };
  }
};

module.exports = { handler };
