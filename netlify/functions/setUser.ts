import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const UserData = require("./models/UserData");

let test: any;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "POST") {
    const SECRET = process.env.WEBHOOK_SECRET;

    if (!SECRET) {
      console.error("Missing WEBHOOK_SECRET key");
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Missing WEBHOOK_SECRET key" }),
      };
    }

    const signature = event.headers["x-webhook-signature"];
    if (!signature) {
      console.error("Missing signature in headers");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing signature in headers" }),
      };
    }

    if (!event.body) {
      console.error("No data");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No data" }),
      };
    }

    try {
      const decoded = jwt.verify(signature, SECRET) as any;
      const expectedHash = decoded.sha256;

      const calculatedHash = crypto
        .createHash("sha256")
        .update(event.body)
        .digest("hex");

      if (calculatedHash !== expectedHash) {
        console.error("Signature is invalid");
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Podpis jest nieprawidłowy" }),
        };
      }

      test = JSON.parse(event.body);

      const { user } = JSON.parse(event.body);
      const { email } = user;

      let findedUser = await UserData.findOne({ email });

      if (!findedUser) {
        const registeredUser = new UserData({
          email,
          confirmed: true,
          lists: [],
        });
        await registeredUser.save();
      }

      findedUser = await UserData.findOne({ email });
      console.log("confirmedUsers", findedUser);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Dodano użytkownika" }),
      };
    } catch (error) {
      console.error("Signature verification error", error);
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

    console.log(test);

    // sprawdza czy użytkownik email jest pomyślnie potwierdzony

    const confirmedUser = await UserData.findOne({
      email,
      confirmed: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        confirmedUser
          ? { message: "User is confirmed", email: confirmedUser.email }
          : { message: "User is not confirmed" }
      ),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method not supported" }),
  };
};

module.exports = { handler };
