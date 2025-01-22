import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserData from "./models/UserData";

const handler: Handler = async (event: HandlerEvent) => {
  console.log("running confirmUser in serverless function");

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
          body: JSON.stringify({ message: "Signature is invalid" }),
        };
      }

      const { user } = JSON.parse(event.body);
      const { email } = user;
      const findedUser = await UserData.findOne({ email });

      if (!findedUser) {
        const registeredUser = new UserData({
          email,
          account: "active",
          lists: [],
        });
        await registeredUser.save();
      } else {
        findedUser.account = "active";
        await findedUser.save();
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User confirmed" }),
      };
    } catch (error) {
      console.error("Signature verification error", error);

      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Signature verification error" }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    const email = event.queryStringParameters?.email;
    const confirmedUser = await UserData.findOne({
      email,
      account: "active",
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
    body: JSON.stringify({ message: "Method not allowed" }),
  };
};

module.exports = { handler };
