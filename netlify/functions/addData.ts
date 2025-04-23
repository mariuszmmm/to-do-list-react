import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { Data } from "../../src/types";

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "PUT") {
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

    if (!data.list) {
      console.error("No list provided");

      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No list provided" }),
      };
    }

    const listIndex = foundUser.lists.findIndex(
      (list) => list.name === data.list?.name
    );

    if (listIndex !== -1) {
      foundUser.lists[listIndex].id = data.list.id;
      foundUser.lists[listIndex].name = data.list.name;
      foundUser.lists[listIndex].taskList = data.list.taskList;
    } else {
      foundUser.lists.push(data.list);
    }

    foundUser.version += 1;
    await foundUser.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data updated successfully",
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
