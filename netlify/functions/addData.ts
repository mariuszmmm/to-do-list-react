// Netlify function to add or update a single list for a user
import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { Data } from "../../src/types";
import { connectToDB } from "./config/mongoose";
import { publishAblyUpdate } from "./config/ably";

const handler: Handler = async (event, context) => {
  // Entry log
  console.log("addData function invoked");

  // Connect to database
  await connectToDB();

  // Only allow PUT method
  if (event.httpMethod !== "PUT") {
    console.log("Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Check for authentication and request body
  if (!context.clientContext || !context.clientContext.user || !event.body) {
    console.log("Unauthorized - Missing client context or body");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Extract user email
  const { email }: { email: string } = context.clientContext.user;
  console.log("User email:", email);

  try {
    // Find user in DB
    const foundUser = (await UserData.findOne({
      email,
      account: "active",
    })) as UserDoc | null;
    if (!foundUser) {
      console.log("User not found:", email);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    console.log("User found:", email, "Lists count:", foundUser.lists.length);

    // Parse request data
    const data: Data = JSON.parse(event.body);
    console.log("Request data:", data);

    // Validate list in request
    if (!data.list) {
      console.log("No list provided in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No list provided" }),
      };
    }
    console.log("List ID:", data.list.id);

    // Find if list exists
    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.list?.id
    );

    let deletedTasksIds: string[] = [];
    if (listIndex !== -1) {
      // Update existing list
      console.log("Updating existing list:", listIndex);
      const incomingList = data.list;
      const existingList = foundUser.lists[listIndex];

      // Check for version conflict
      if (incomingList.version !== existingList.version) {
        console.log("Version mismatch detected for list ID:", data.list.id);
        return {
          statusCode: 409,
          body: JSON.stringify({
            message: "Conflict detected: Version mismatch.",
            data: {
              email: foundUser.email,
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
      existingList.name = incomingList.name;
      existingList.taskList = incomingList.taskList.filter(
        (task) => !deletedTasksIds.includes(task.id)
      );
      existingList.date = incomingList.date;
      existingList.version = (existingList.version || 0) + 1;
    } else {
      // Add new list
      console.log("Adding new list");
      const newList = {
        ...data.list,
        version: 0,
      };
      foundUser.lists.push(newList);
    }

    // Save user data
    const savedUser = await foundUser.save();
    if (!savedUser) {
      console.error("Save operation failed for user:", email);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save data." }),
      };
    }
    console.log("Data updated successfully for user:", email);

    // Publish update via Ably
    try {
      await publishAblyUpdate(email, {
        lists: savedUser.lists,
        deviceId: data.list.deviceId,
        ...(deletedTasksIds.length ? { deletedTasksIds } : {}),
        updatedAt: data.list.updatedAt,
      });
    } catch (ablyError) {
      console.error("Ably publish error:", ablyError);
    }

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data updated successfully",
        data: {
          lists: savedUser.lists,
          deviceId: data.list.deviceId,
          ...(deletedTasksIds.length ? { deletedTasksIds } : {}),
          updatedAt: data.list.updatedAt,
        },
      }),
    };
  } catch (error) {
    // Error response
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Export handler
module.exports = { handler };
