import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { Data } from "../../src/types";

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "DELETE") {
    console.error("Method Not Allowed");

    return {
      statusCode: 405,
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

  try {
    const foundUser = await UserData.findOne({ email, account: "active" });

    if (!foundUser) {
      console.error("User not found");

      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const data: Data = JSON.parse(event.body);

    if (foundUser.version !== data.version) {
      console.error("Version mismatch");

      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Version mismatch",
          data: {
            email: foundUser.email,
            lists: foundUser.lists,
            version: foundUser.version,
            conflict: true,
          },
        }),
      };
    }

    if (!data.listId) {
      console.error("No list ID provided");

      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No list ID provided" }),
      };
    }

    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.listId
    );

    if (listIndex !== -1) {
      foundUser.lists.splice(listIndex, 1);
      foundUser.version += 1;

      await foundUser.save();
    } else {
      console.error("List not found");

      return {
        statusCode: 404,
        body: JSON.stringify({ message: "List not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data updated",
        data: {
          email: foundUser.email,
          lists: foundUser.lists,
          version: foundUser.version,
        },
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

module.exports = { handler };
