import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "PUT" && event.httpMethod !== "DELETE") {
    console.error("Method Not Allowed");

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  if (!context.clientContext || !context.clientContext.user || !event.body) {
    console.log("Unauthorized");

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { email } = context.clientContext.user;

  const user = await UserData.findOne({ email, account: "active" });
  if (!user) {
    console.error("User not found");

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    if (event.httpMethod === "PUT") {
      await UserData.findOneAndUpdate(
        { email: email },
        { $push: { lists: data } },
        { new: true }
      );
    }

    if (event.httpMethod === "DELETE") {
      await UserData.findOneAndUpdate(
        { email: email },
        { $pull: { lists: { id: data.id } } },
        { new: true }
      );
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
    body: JSON.stringify({ message: "Data updated" }),
  };
};

module.exports = { handler };
