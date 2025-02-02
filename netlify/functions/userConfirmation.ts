import type { Handler, HandlerEvent } from "@netlify/functions";

let confirmedUsers: string[] = ["test@poczta.pl"];
let SECRET: string | undefined;
let test: any;
let test1: any;
let test2: any;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "POST") {
    SECRET = process.env.WEBHOOK_SECRET;
    const signature = event.headers["x-netlify-signature"];
    test = event.headers;
    test1 = event.body;
    test2 = event.headers["x-netlify-signature"];

    if (signature !== SECRET) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Nieautoryzowany" }),
      };
    }

    if (event.body) {
      const { user } = JSON.parse(event.body);
      const { email } = user;
      confirmedUsers.push(email);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Dodano użytkownika" }),
    };
  }

  if (event.httpMethod === "GET") {
    const email = event.queryStringParameters?.email;
    const confirmedUser = confirmedUsers.find((user) => user === email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: confirmedUser
          ? "Użytkownik jest potwierdzony"
          : "Użytkownik nie jest potwierdzony",
        confirmedUser,
        confirmedUsers,
        SECRET,
        test,
        test1,
        test2,
      }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Metoda nie jest obsługiwana" }),
  };
};

module.exports = { handler };
