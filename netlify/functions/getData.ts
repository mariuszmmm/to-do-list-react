import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import UserData from "./models/UserData";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (!context.clientContext || !context.clientContext.user) {
    console.error("Unauthorized");

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  try {
    const { email }: { email: string } = context.clientContext.user;
    const userData = await UserData.findOne({ email, account: "active" });

    if (!userData) {
      console.error("User not found");

      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User data found",
        data: {
          email: userData.email,
          lists: userData.lists,
          version: userData.version,
        },
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

module.exports = { handler };
