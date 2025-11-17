import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "./models/UserData";
import { Data } from "../../src/types";
import { connectToDB } from "./config/mongoose";
import { publishAblyUpdate } from "./config/ably";

const handler: Handler = async (event, context) => {
  console.log("Handler invoked - Method:", event.httpMethod);

  await connectToDB();

  if (event.httpMethod !== "PUT") {
    console.log("Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  if (!context.clientContext || !context.clientContext.user || !event.body) {
    console.log("Unauthorized - Missing client context or body");
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
    console.log("User found:", email, "Lists count:", foundUser.lists.length);

    const data: Data = JSON.parse(event.body);
    if (!data.list) {
      console.log("No list provided in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No list provided" }),
      };
    }
    console.log("Processing list:", data.list.id);

    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.list?.id
    );

    if (listIndex !== -1 && data.list) {
      console.log("Updating existing list at index:", listIndex);
      const incomingList = data.list;
      const existingList = foundUser.lists[listIndex];

      if (incomingList.version !== existingList.version) {
        console.log("Version conflict detected. Attempting to merge changes.");

        const hasNameConflict = existingList.name !== incomingList.name;
        if (hasNameConflict) {
          console.log("Name conflict found. Returning current server state.");
          return {
            statusCode: 200,
            body: JSON.stringify({
              conflict: true,
              message: "Conflict detected: List name has been changed.",
              data: { email: foundUser.email, lists: foundUser.lists },
            }),
          };
        }

        console.log("No name conflict. Merging task list changes.");

        const mergedTasks = [...existingList.taskList];

        for (const incomingTask of incomingList.taskList) {
          const existingTaskIndex = mergedTasks.findIndex(
            (t) => t.id === incomingTask.id
          );

          if (existingTaskIndex !== -1) {
            const existingTask = mergedTasks[existingTaskIndex];

            const clientContentChanged =
              existingTask.content !== incomingTask.content;
            const clientDoneChanged = existingTask.done !== incomingTask.done;

            if (clientContentChanged) {
              console.log(
                `Content conflict for task ${incomingTask.id}. Server version is kept.`
              );
            }

            if (clientDoneChanged) {
              if (incomingTask.done) {
                mergedTasks[existingTaskIndex] = {
                  ...existingTask,
                  done: true,
                };
                console.log(
                  `Merged 'done' status for task ${incomingTask.id} to true.`
                );
              }
            }
          } else {
            mergedTasks.push(incomingTask);
            console.log(`Added new task with id ${incomingTask.id}.`);
          }
        }

        existingList.taskList = mergedTasks;
      } else {
        console.log("No version conflict. Updating list directly.");
        existingList.name = incomingList.name;
        existingList.taskList = incomingList.taskList;
      }

      existingList.date = incomingList.date;
      existingList.version = (existingList.version || 0) + 1;

      console.log("List updated - new version:", existingList.version);
    } else {
      console.log("Creating new list:", data.list.id);
      const newList = {
        ...data.list,
        version: 0,
      };
      foundUser.lists.push(newList);
    }

    const savedUser = await foundUser.save();

    if (!savedUser) {
      console.error(
        "Save operation did not return a user object for user:",
        email
      );
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to save data." }),
      };
    }

    console.log("Data saved successfully for user:", email);

    // Publikuj aktualizację przez Ably
    await publishAblyUpdate(email, {
      email: savedUser.email,
      lists: savedUser.lists,
    });

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
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

module.exports = { handler };
