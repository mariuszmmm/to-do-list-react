import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
const User = require("./models/User");

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (!context.clientContext || !context.clientContext.custom) {
    console.error("Invalid context");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid context" }),
    };
  }
  const rawNetlifyContext = context.clientContext.custom.netlify;
  const netlifyContext = Buffer.from(rawNetlifyContext, "base64").toString(
    "utf-8"
  );
  const { identity, user } = JSON.parse(netlifyContext);
  console.log("identity ,user   ", identity, user);

  if (!user) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "DANE NIEPRAWIDŁOWE" }),
    };
  }

  try {
    let userFound = await User.findOne({ id: user.sub });
    if (!userFound) {
      const NewUser = new User({
        id: user.sub,
        email: user.email,
        lists: [],
      });
      await NewUser.save();
      userFound = await User.findOne({ id: user.sub });
    }

    console.log("ZALOGOWANO !!!!!!!!!!!!!!", userFound);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "ZALOGOWANO",
        user: {
          id: userFound.id,
          email: userFound.email,
          lists: userFound.lists,
        },
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "WYSTĄPIŁ BŁĄD LOGOWANIA" }),
    };
  }
};

module.exports = { handler };
