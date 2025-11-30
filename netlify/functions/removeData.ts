// Netlify function to remove a list for a user
import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { Data } from "../../src/types";
import { publishAblyUpdate } from "./config/ably";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event, context) => {
  // Entry log
  console.log("removeData function invoked");

  // Connect to database
  await connectToDB();

  // Only allow DELETE method
  if (event.httpMethod !== "DELETE") {
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

    // Validate listId in request
    if (!data.listId) {
      console.log("No list ID provided");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No list ID provided" }),
      };
    }
    console.log("Removing list with ID:", data.listId);

    // Find list index
    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.listId
    );

    if (listIndex !== -1) {
      // List found, check version
      console.log("List found at index:", listIndex);
      if (foundUser.lists[listIndex].version !== data.version) {
        console.log("Version mismatch for list ID:", data.listId);
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

      // Remove list and save
      console.log("Versions match. Proceeding with removal.");
      foundUser.lists.splice(listIndex, 1);
      const savedUser = await foundUser.save();
      if (!savedUser) {
        console.error("Save operation failed for user:", email);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Failed to save user data." }),
        };
      }
      console.log("List removed and data saved successfully for user:", email);

      // Publish update via Ably
      try {
        await publishAblyUpdate(email, {
          lists: savedUser.lists,
          deviceId: data.deviceId,
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
            deviceId: data.deviceId,
          },
        }),
      };
    } else {
      // List not found
      console.log("List not found:", data.listId);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "List not found" }),
      };
    }
  } catch (error) {
    // Error response
    console.error("Error in removeData function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Export handler
module.exports = { handler };
