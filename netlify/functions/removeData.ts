import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { Data } from "../../src/types";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event, context) => {
  console.log("removeData function invoked");

  await connectToDB();

  if (event.httpMethod !== "DELETE") {
    console.log("Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  if (!context.clientContext || !context.clientContext.user || !event.body) {
    console.log("Unauthorized request");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { email }: { email: string } = context.clientContext.user;
  console.log("Processing request for user:", email);

  try {
    const foundUser = (await UserData.findOne({
      email,
      account: "active",
    })) as UserDoc | null;
    if (!foundUser) {
      console.log("User not found:", email);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const data: Data = JSON.parse(event.body);
    console.log("Request data:", data);

    if (!data.listId) {
      console.log("No list ID provided");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No list ID provided" }),
      };
    }

    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.listId
    );
    if (listIndex === -1) {
      console.log("List not found:", data.listId);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "List not found" }),
      };
    }

    if (
      data.version === undefined ||
      foundUser.lists[listIndex].version !== data.version
    ) {
      console.log(
        "Version mismatch - client:",
        data.version,
        "server:",
        foundUser.lists[listIndex].version
      );
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Version mismatch",
          data: {
            email: foundUser.email,
            lists: foundUser.lists,
            conflict: true,
          },
        }),
      };
    }

    foundUser.lists.splice(listIndex, 1);
    const savedUser = await foundUser.save();
    if (!savedUser) {
      console.error("Save operation failed for user:", email);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save user data." }),
      };
    }
    console.log("List removed successfully for user:", email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data updated successfully",
        data: {
          email: savedUser.email,
          lists: savedUser.lists,
        },
      }),
    };
  } catch (error) {
    console.error("Error in removeData function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

module.exports = { handler };
