import { List, Version } from "./../../src/types";
import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";

type Data = {
  version: Version;
  list?: List;
  listId?: string;
};

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "PUT" && event.httpMethod !== "DELETE") {
    console.error("Method Not Allowed");

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  if (!context.clientContext || !context.clientContext.user || !event.body) {
    console.error("Unauthorized");

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { email }: { email: string } = context.clientContext.user;
  const user = await UserData.findOne({ email, account: "active" });

  if (!user) {
    console.error("User not found");

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" }),
    };
  }

  const data: Data = JSON.parse(event.body);

  if (user.version !== data.version) {
    console.error("Version mismatch");

    return {
      statusCode: 409,
      body: JSON.stringify({ message: "Version mismatch" }),
    };
  }

  try {
    if (event.httpMethod === "PUT") {
      if (!data.list) {
        console.error("No list provided");

        return {
          statusCode: 400,
          body: JSON.stringify({ message: "No list provided" }),
        };
      }

      const userUpdated = await UserData.findOneAndUpdate(
        { email: email },
        { $push: { lists: data.list } },
        { new: true }
      );

      if (!userUpdated) {
        console.error("User not found");

        return {
          statusCode: 404,
          body: JSON.stringify({ message: "User not found" }),
        };
      }

      user.version += 1;
      await user.save();
    }

    if (event.httpMethod === "DELETE") {
      if (!data.listId) {
        console.error("No list ID provided");

        return {
          statusCode: 400,
          body: JSON.stringify({ message: "No list ID provided" }),
        };
      }

      const userUpdated = await UserData.findOneAndUpdate(
        { email: email },
        { $pull: { lists: { id: data.listId } } },
        { new: true }
      );

      if (!userUpdated) {
        console.error("User not found");

        return {
          statusCode: 404,
          body: JSON.stringify({ message: "User not found" }),
        };
      }

      user.version += 1;
      await user.save();
    }
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Data updated", version: user.version }),
  };
};

module.exports = { handler };
