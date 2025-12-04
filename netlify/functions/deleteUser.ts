// Netlify function to delete a user
import { HandlerContext, HandlerEvent } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler = async (_event: HandlerEvent, context: HandlerContext) => {
  // Entry log
  console.log("[deleteUser] Delete user function invoked");

  // Connect to database
  await connectToDB();

  // Check for authentication
  if (
    !context.clientContext ||
    !context.clientContext.user ||
    !context.clientContext.identity
  ) {
    console.error("[deleteUser] Unauthorized access attempt");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
  const { identity, user } = context.clientContext;
  const userID = user.sub;
  const email = user.email;
  const userUrl = `${identity.url}/admin/users/{${userID}}`;
  const adminAuthHeader = `Bearer ${identity.token}`;

  console.log(
    `[deleteUser] Attempting to delete user: ${email} (ID: ${userID})`
  );

  try {
    // Find user in DB
    const userData = await UserData.findOne({ email, account: "active" });
    if (!userData) {
      console.error(`[deleteUser] User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Delete user from identity API
    const response = await fetch(userUrl, {
      method: "DELETE",
      headers: { Authorization: adminAuthHeader },
    });
    if (!response.ok) {
      console.error(
        `[deleteUser] Failed to delete user from identity: ${response.status} - ${response.statusText}`
      );
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: response.statusText }),
      };
    }

    // Mark user as deleted in DB
    const updateResult = await UserData.updateOne(
      { email },
      { account: "deleted" }
    );
    if (updateResult.modifiedCount === 0) {
      console.error(
        `[deleteUser] Failed to update user account to 'deleted': ${email}`
      );
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to update user account." }),
      };
    }

    // Success response
    console.log(`[deleteUser] User successfully deleted: ${email}`);
    return { statusCode: 204 };
  } catch (error) {
    // Error response
    console.error("[deleteUser] Failed to delete user", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete user" }),
    };
  }
};

// Export handler
module.exports = { handler };
