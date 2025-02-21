import { HandlerContext, HandlerEvent } from "@netlify/functions";
import UserData from "./models/UserData";

const handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (
    !context.clientContext ||
    !context.clientContext.user ||
    !context.clientContext.identity
  ) {
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

  try {
    const userData = await UserData.findOne({ email, account: "active" });

    if (!userData) {
      console.error("User not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const response = await fetch(userUrl, {
      method: "DELETE",
      headers: { Authorization: adminAuthHeader },
    });

    if (!response.ok) {
      console.error("Failed to delete user", response.statusText);

      return {
        statusCode: response.status,
        body: JSON.stringify({ message: response.statusText }),
      };
    }

    await UserData.updateOne(
      { email },
      { account: "deleted" },
      { version: userData.version + 1 }
    );

    return { statusCode: 204 };
  } catch (error) {
    console.error("Failed to delete user", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete user" }),
    };
  }
};

module.exports = { handler };
