import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { connectToDB } from "./config/mongoose";
import { Data } from "../../src/types";

const handler: Handler = async (event, context) => {
  console.log("updateData function invoked");

  await connectToDB();

  if (
    event.httpMethod !== "PUT" ||
    !context.clientContext?.user ||
    !event.body
  ) {
    console.log("Bad Request:", {
      method: event.httpMethod,
      hasUser: !!context.clientContext?.user,
      hasBody: !!event.body,
    });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" }),
    };
  }

  const { email } = context.clientContext.user;
  console.log("User email:", email);

  try {
    const user = (await UserData.findOne({
      email,
      account: "active",
    })) as UserDoc | null;
    if (!user) {
      console.log("User not found:", email);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const data: Data = JSON.parse(event.body);
    if (!data.lists) {
      console.log("No lists provided in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No lists provided" }),
      };
    }
    console.log("Incoming lists count:", data.lists?.length);

    if (!Array.isArray(data.lists)) {
      console.log("Invalid lists data");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No lists provided" }),
      };
    }

    // Check for version conflicts
    for (const incomingList of data.lists) {
      const dbList = user.lists.find((l) => l.id === incomingList.id);
      if (dbList && dbList.version !== incomingList.version) {
        console.log("Version conflict:", {
          listId: incomingList.id,
          dbVersion: dbList.version,
          incomingVersion: incomingList.version,
        });
        return {
          statusCode: 409,
          body: JSON.stringify({
            message: "Version mismatch",
            data: {
              email: user.email,
              lists: user.lists,
              conflict: true,
              conflictListId: incomingList.id,
            },
          }),
        };
      }
    }

    // Update or add lists, increment version only if changed
    data.lists.forEach((incomingList) => {
      const idx = user.lists.findIndex((l) => l.id === incomingList.id);
      if (idx !== -1) {
        const dbList = user.lists[idx];
        const changed =
          dbList.name !== incomingList.name ||
          dbList.date !== incomingList.date ||
          JSON.stringify(dbList.taskList) !==
            JSON.stringify(incomingList.taskList);
        if (changed) {
          console.log("Updating list:", incomingList.id);
          dbList.name = incomingList.name;
          dbList.date = incomingList.date;
          dbList.taskList = incomingList.taskList;
          dbList.version = (incomingList.version || 0) + 1;
        } else {
          console.log("No changes for list:", incomingList.id);
        }
      } else {
        console.log("Adding new list:", incomingList.id);
        user.lists.push({ ...incomingList, version: 0 });
      }
    });

    // Set the order to match frontend
    const sortedLists = data.lists.map((incomingList) => {
      const currentList = user.lists.find((l) => l.id === incomingList.id);
      return currentList ? currentList : { ...incomingList, version: 0 };
    });
    user.lists.splice(0, user.lists.length);
    sortedLists.forEach((listItem) => user.lists.push(listItem));

    const savedUser = await user.save();
    if (!savedUser) {
      console.error("Save operation failed for user:", email);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save user data." }),
      };
    }
    console.log("User data saved successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "OK",
        data: {
          email: savedUser.email,
          lists: savedUser.lists,
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
