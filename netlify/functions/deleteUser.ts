import { HandlerContext, HandlerEvent } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler = async (_event: HandlerEvent, context: HandlerContext) => {
  console.log("Delete user function invoked");

  await connectToDB();

  if (
    !context.clientContext ||
    !context.clientContext.user ||
    !context.clientContext.identity
  ) {
    console.error("Unauthorized access attempt");
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

  console.log(`Attempting to delete user: ${email} (ID: ${userID})`);

  try {
    const userData = await UserData.findOne({ email, account: "active" });

    if (!userData) {
      console.error(`User not found: ${email}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    console.log(`User found in database, calling identity API: ${userUrl}`);

    const response = await fetch(userUrl, {
      method: "DELETE",
      headers: { Authorization: adminAuthHeader },
    });

    if (!response.ok) {
      console.error(
        `Failed to delete user from identity: ${response.status} - ${response.statusText}`
      );

      return {
        statusCode: response.status,
        body: JSON.stringify({ message: response.statusText }),
      };
    }

    console.log(`User deleted from identity, updating database`);
    const updateResult = await UserData.updateOne(
      { email },
      { account: "deleted" }
    );

    if (updateResult.modifiedCount === 0) {
      console.error(`Failed to update user account to 'deleted': ${email}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to update user account." }),
      };
    }

    console.log(`User successfully deleted: ${email}`);
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
