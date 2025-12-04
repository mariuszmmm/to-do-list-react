// Netlify function to get user data
import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event, context) => {
  // Entry log
  console.log("[getData] Function invoked");

  // Check for authentication
  if (!context.clientContext || !context.clientContext.user) {
    console.log("[getData] Unauthorized access attempt");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Connect to database
  await connectToDB();

  try {
    // Extract user email
    const { email }: { email: string } = context.clientContext.user;
    console.log(`[getData] Fetching data for user: ${email}`);

    // Find user data
    const userData = await UserData.findOne({ email, account: "active" });
    if (!userData) {
      console.log(`[getData] User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Success response
    console.log(`[getData] User data found for: ${email}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User data found",
        data: {
          email: userData.email,
          lists: userData.lists,
        },
      }),
    };
  } catch (error) {
    // Error response
    console.error("[getData] Error fetching user data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// Export handler
module.exports = { handler };
