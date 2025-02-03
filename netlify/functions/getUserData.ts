import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
const UserData = require("./models/UserData");

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (!context.clientContext || !context.clientContext.user) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Dane nieprawidłowe" }),
    };
  }
  const { email }: { email: string } = context.clientContext.user;

  try {
    const userDataFound = await UserData.findOne({ email });

    if (!userDataFound) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Błąd serwera" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pobrano listy",
        userData: {
          email: userDataFound.email,
          lists: userDataFound.lists,
        },
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Błąd serwera" }),
    };
  }
};

module.exports = { handler };
