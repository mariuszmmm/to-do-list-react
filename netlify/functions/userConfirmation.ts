import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";

let confirmedUsers: string[] = ["test@poczta.pl"];
let SECRET: string | undefined;
let test: any;
let test1: any;
let test2: any;
let test3: any;
let test4: any;
let test5: any;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "POST") {
    SECRET = process.env.WEBHOOK_SECRET;
    if (!SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Brak klucza WEBHOOK_SECRET" }),
      };
    }

    const signature = event.headers["x-webhook-signature"];
    test = signature;
    if (!signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Brak podpisu w nagłówkach" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Brak danych" }),
      };
    }
    test1 = event.body;

    try {
      // Odszyfruj JWT i pobierz hash `sha256`
      const decoded = jwt.verify(
        signature,
        SECRET
        //    {
        //   issuer: "netlify",
        //   algorithms: ["HS256"],
        // }
      ) as any;
      const expectedHash = decoded.sha256;
      test2 = decoded;
      test3 = expectedHash;

      // Oblicz hash z event.body
      const calculatedHash = crypto
        .createHash("sha256")
        .update(event.body)
        .digest("hex");
      test4 = calculatedHash;

      // Sprawdź, czy hash się zgadza
      if (calculatedHash !== expectedHash) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Podpis jest nieprawidłowy" }),
        };
      }

      const { user } = JSON.parse(event.body);
      test5 = user;
      const { email } = user;
      confirmedUsers.push(email);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Dodano użytkownika" }),
      };
    } catch (error) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Błąd weryfikacji podpisu",
          error: error.message,
        }),
      };
    }
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
        test5,
      }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Metoda nie jest obsługiwana" }),
  };
};

module.exports = { handler };
