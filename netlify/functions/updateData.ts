// Netlify function to update multiple lists for a user
import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { connectToDB } from "./config/mongoose";
import { Data } from "../../src/types";
import { publishAblyUpdate } from "./config/ably";

const handler: Handler = async (event, context) => {
  // Entry log
  process.env.NODE_ENV === "development" &&
    console.log("[updateData] Function invoked");

  // Connect to database
  await connectToDB();

  // Only allow PUT method
  if (event.httpMethod !== "PUT") {
    process.env.NODE_ENV === "development" &&
      console.log("[updateData] Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Check for authentication and request body
  if (!context.clientContext || !context.clientContext.user || !event.body) {
    process.env.NODE_ENV === "development" &&
      console.log("[updateData] Unauthorized - Missing client context or body");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Extract user email
  const { email }: { email: string } = context.clientContext.user;
  process.env.NODE_ENV === "development" &&
    console.log("[updateData] User email:", email);

  try {
    // Find user in DB
    const foundUser = (await UserData.findOne({
      email,
      account: "active",
    })) as UserDoc | null;
    if (!foundUser) {
      process.env.NODE_ENV === "development" &&
        console.log("[updateData] User not found:", email);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    process.env.NODE_ENV === "development" &&
      console.log(
        "[updateData] User found:",
        email,
        "Lists count:",
        foundUser.lists.length
      );

    // Parse request data
    const data: Data = JSON.parse(event.body);
    process.env.NODE_ENV === "development" &&
      console.log("[updateData] Request data:", data);

    // Validate lists in request
    if (!data.lists) {
      process.env.NODE_ENV === "development" &&
        console.log("[updateData] No lists provided in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No lists provided" }),
      };
    }
    process.env.NODE_ENV === "development" &&
      console.log("[updateData] Incoming lists count:", data.lists?.length);

    if (!Array.isArray(data.lists)) {
      process.env.NODE_ENV === "development" &&
        console.log("[updateData] Invalid lists data");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No lists provided" }),
      };
    }

    // Check for version conflicts
    for (const incomingList of data.lists) {
      const dbList = foundUser.lists.find((l) => l.id === incomingList.id);
      if (dbList && dbList.version !== incomingList.version) {
        process.env.NODE_ENV === "development" &&
          console.log(
            "[updateData] Version mismatch detected for list ID:",
            incomingList.id
          );
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
    }

    process.env.NODE_ENV === "development" &&
      console.log("[updateData] All versions match. Proceeding with update.");

    // Update or add lists
    data.lists.forEach((incomingList) => {
      const idx = foundUser.lists.findIndex((l) => l.id === incomingList.id);
      if (idx !== -1) {
        // Update existing list if changed
        const dbList = foundUser.lists[idx];
        const changed =
          dbList.name !== incomingList.name ||
          dbList.date !== incomingList.date ||
          JSON.stringify(dbList.taskList) !==
            JSON.stringify(incomingList.taskList);
        if (changed) {
          process.env.NODE_ENV === "development" &&
            console.log(
              "[updateData] Updating existing list:",
              incomingList.id
            );
          dbList.name = incomingList.name;
          dbList.date = incomingList.date;
          dbList.taskList = incomingList.taskList;
          dbList.version = (incomingList.version || 0) + 1;
        } else {
          process.env.NODE_ENV === "development" &&
            console.log(
              "[updateData] No changes detected for list ID:",
              incomingList.id
            );
        }
      } else {
        // Add new list
        process.env.NODE_ENV === "development" &&
          console.log("[updateData] Adding new list:", incomingList.id);
        foundUser.lists.push({ ...incomingList, version: 0 });
      }
    });

    // Sort lists to match incoming order
    const sortedLists = data.lists.map((incomingList) => {
      const currentList = foundUser.lists.find((l) => l.id === incomingList.id);
      return currentList ? currentList : { ...incomingList, version: 0 };
    });
    foundUser.lists.splice(0, foundUser.lists.length);
    sortedLists.forEach((listItem) => foundUser.lists.push(listItem));

    // Save user data
    const savedUser = await foundUser.save();
    if (!savedUser) {
      console.error("[updateData] Save operation failed for user:", email);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save user data." }),
      };
    }
    process.env.NODE_ENV === "development" &&
      console.log("[updateData] Data updated successfully for user:", email);

    // Publish update via Ably
    try {
      await publishAblyUpdate(email, {
        lists: savedUser.lists,
        deviceId: data.deviceId,
      });
    } catch (ablyError) {
      console.error("[updateData] Ably publish error:", ablyError);
    }

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "[updateData] Data updated successfully",
        data: {
          lists: savedUser.lists,
          deviceId: data.deviceId,
        },
      }),
    };
  } catch (error) {
    // Error response
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Export handler
module.exports = { handler };
