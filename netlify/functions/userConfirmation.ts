import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";

let confirmedUsers: string[] = ["test@poczta.pl"];
let SECRET: string | undefined;
let test: any;
let test1: any;
let test2: any;
let test3: any;
let test4: any;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "POST") {
    SECRET = process.env.WEBHOOK_SECRET;
    const signature = event.headers["x-webhook-signature"];

    test = event.headers;
    test1 = signature;

    if (!signature || !SECRET) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Brak podpisu" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Brak danych" }),
      };
    }

    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(event.body, "utf8");
    const calculatedSignature = hmac.digest("hex");

    test2 = calculatedSignature;
    test3 = event.body;

    console.log("SECRET:", SECRET);
    console.log("Signature from header:", signature);
    console.log("Calculated signature:", calculatedSignature);
    console.log("Event body:", event.body);

    if (calculatedSignature !== signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Podpis nie jest prawidłowy" }),
      };
    }

    const { user } = JSON.parse(event.body);
    const { email } = user;
    confirmedUsers.push(email);

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
        test3,
        test4,
      }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Metoda nie jest obsługiwana" }),
  };
};

module.exports = { handler };
