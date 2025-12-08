// Netlify function to confirm user via webhook
import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";
import { publishConfirmation } from "./config/ably";

const handler: Handler = async (event: HandlerEvent) => {
  // Entry log
  console.log(
    `[confirmUser] [${new Date().toISOString()}] Request received: ${
      event.httpMethod
    }`
  );

  await connectToDB();

  // Only allow POST method
  if (event.httpMethod !== "POST") {
    console.error("[confirmUser] Method Not Allowed");
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Get secret from environment
  const SECRET = process.env.WEBHOOK_SECRET;
  if (!SECRET) {
    console.error("[confirmUser] Missing WEBHOOK_SECRET key");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Missing WEBHOOK_SECRET key" }),
    };
  }

  // Validate signature header
  const signature = event.headers["x-webhook-signature"];
  if (!signature) {
    console.error("[confirmUser] Missing signature in headers");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing signature in headers" }),
    };
  }

  // Validate request body
  if (!event.body) {
    console.error("[confirmUser] No data");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No data" }),
    };
  }

  try {
    // Verify JWT signature
    const decoded = jwt.verify(signature, SECRET) as any;
    const expectedHash = decoded.sha256;
    const calculatedHash = crypto
      .createHash("sha256")
      .update(event.body)
      .digest("hex");
    if (calculatedHash !== expectedHash) {
      console.error("[confirmUser] Signature is invalid");
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Signature is invalid" }),
      };
    }

    // Parse user data
    const { user } = JSON.parse(event.body);
    const { email } = user;
    console.log(`[confirmUser] Processing user: ${email}`);

    // Find or create user
    let findedUser = await UserData.findOne({ email });
    if (!findedUser) {
      console.log(`[confirmUser] Creating new user: ${email}`);
      const registeredUser = new UserData({
        email,
        account: "active",
        lists: [],
      });
      findedUser = await registeredUser.save();
      if (!findedUser) {
        console.error(`[confirmUser] Failed to create user: ${email}`);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Failed to create user." }),
        };
      }
    }

    // Send Ably notification to user's confirmation channel
    try {
      await publishConfirmation(email, {
        type: "user-confirmed",
        email,
        confirmedAt: new Date().toISOString(),
      });
      console.log(`[confirmUser] Ably notification sent for user: ${email}`);
    } catch (ablyError) {
      console.error(
        `[confirmUser] Failed to send Ably notification:`,
        ablyError
      );
      // Don't fail the webhook if Ably fails - user is already confirmed in MongoDB
    }

    // Success response
    console.log(`[confirmUser] User confirmed: ${email}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User confirmed", email }),
    };
  } catch (error) {
    // Error response
    console.error("[confirmUser] Error confirming user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Export handler
module.exports = { handler };
