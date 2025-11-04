import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event, context) => {
  console.log("getData function invoked");

  if (!context.clientContext || !context.clientContext.user) {
    console.log("Unauthorized access attempt");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  await connectToDB();

  try {
    const { email }: { email: string } = context.clientContext.user;
    console.log(`Fetching data for user: ${email}`);

    const userData = await UserData.findOne({ email, account: "active" });

    if (!userData) {
      console.log(`User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    console.log(`User data found for: ${email}`);
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
    console.error("Error fetching user data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

module.exports = { handler };
