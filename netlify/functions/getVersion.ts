import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import UserData from "./models/UserData";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (!context.clientContext || !context.clientContext.user) {
    console.error("Unauthorized");

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
  const { email }: { email: string } = context.clientContext.user;

  try {
    const userData = await UserData.findOne({ email, account: "active" });

    if (!userData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User data found",
        version: userData.version,
      }),
    };
  } catch (error) {
    console.error("Error", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

module.exports = { handler };
