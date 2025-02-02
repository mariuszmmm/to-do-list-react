import type { Handler, HandlerEvent } from "@netlify/functions";
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

let confirmedUsers: string[] = ["test@poczta.pl"];
let SECRET: string | undefined;
let test: any;
let test1: any;
let test2: any;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "POST") {
    SECRET = process.env.WEBHOOK_SECRET;
    const signature = event.headers["x-webhook-signature"];
    test = event.headers;

    test2 = signature;

    if (!signature || !SECRET) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Brak podpisu" }),
      };
    }

    try {
      const decoded = jwt.verify(signature, SECRET);
      test1 = decoded;
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Podpis jest nieprawidłowy" }),
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
