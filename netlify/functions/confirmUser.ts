import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event: HandlerEvent) => {
  console.log(
    `[${new Date().toISOString()}] Request received: ${event.httpMethod}`
  );

  await connectToDB();

  if (event.httpMethod === "POST") {
    console.log("[POST] Processing user confirmation");
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
      console.log("[POST] Verifying JWT signature");
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

      console.log("[POST] Signature verified successfully");
      const { user } = JSON.parse(event.body);
      const { email } = user;
      console.log(`[POST] Processing user: ${email}`);

      const findedUser = await UserData.findOne({ email });

      if (!findedUser) {
        console.log(`[POST] Creating new user: ${email}`);
        const registeredUser = new UserData({
          email,
          account: "active",
          lists: [],
        });
        const savedUser = await registeredUser.save();
        if (!savedUser) {
          console.error(`[POST] Failed to create user: ${email}`);
          return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to create user." }),
          };
        }
        console.log(`[POST] User created: ${email}`);
      } else {
        console.log(`[POST] Activating existing user: ${email}`);
        findedUser.account = "active";
        const savedUser = await findedUser.save();
        if (!savedUser) {
          console.error(`[POST] Failed to activate user: ${email}`);
          return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to activate user." }),
          };
        }
        console.log(`[POST] User activated: ${email}`);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "User confirmed",
        }),
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
    console.log(`[GET] Checking user confirmation status: ${email}`);

    const confirmedUser = await UserData.findOne({
      email,
      account: "active",
    });

    console.log(
      `[GET] User ${email} is ${confirmedUser ? "confirmed" : "not confirmed"}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify(
        confirmedUser
          ? {
              message: "User is confirmed",
              email: confirmedUser.email,
            }
          : { message: "User is not confirmed" }
      ),
    };
  }

  console.warn(`[${event.httpMethod}] Method not allowed`);
  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method not allowed" }),
  };
};

module.exports = { handler };
