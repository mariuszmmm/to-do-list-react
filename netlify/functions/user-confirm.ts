import type { Handler } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { publishConfirmation } from "../config/ably";
import {
  checkEventBody,
  checkHttpMethod,
  checkWebhookSecret,
  checkWebhookSignature,
} from "../functions/lib/validators";
import { jsonResponse, logError } from "../functions/lib/response";

const handler: Handler = async (event) => {
  const logPrefix = "[confirmUser]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const SECRET = checkWebhookSecret(logPrefix);
  if (typeof SECRET !== "string") return SECRET;

  const signature = checkWebhookSignature(event.headers, logPrefix);
  if (typeof signature !== "string") return signature;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  await connectToDB();

  try {
    const body = event.body as string;
    const decoded = jwt.verify(signature, SECRET) as any;
    const expectedHash = decoded.sha256;
    const calculatedHash = crypto
      .createHash("sha256")
      .update(body)
      .digest("hex");
    if (calculatedHash !== expectedHash) {
      return jsonResponse(403, { message: "Signature is invalid" });
    }

    let parsedBody: { user?: { email?: string } };
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, { message: "Invalid JSON in request body" });
    }

    const email = parsedBody?.user?.email;
    if (!email) {
      console.warn(`${logPrefix} Missing email in user object`);
      return jsonResponse(400, { message: "Email is required" });
    }

    let foundUser = await UserData.findOne({ email }).exec();
    if (!foundUser) {
      const registeredUser = new UserData({
        email,
        account: "active",
        lists: [],
      });
      foundUser = await registeredUser.save();
      if (!foundUser) {
        return jsonResponse(500, { message: "Failed to create user." });
      }
    }

    try {
      await publishConfirmation(email, {
        type: "user-confirmed",
        email,
        confirmedAt: new Date().toISOString(),
      });
    } catch (ablyError) {
      logError("Failed to send Ably notification", ablyError, logPrefix);
    }

    return jsonResponse(200, { message: "User confirmed", email });
  } catch (error) {
    logError("Unexpected error in confirmUser handler", error, logPrefix);
    return jsonResponse(500, { message: "Internal Server Error" });
  }
};

module.exports = { handler };
