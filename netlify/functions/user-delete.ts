import type { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../functions/lib/response";
import {
  checkClientContext,
  checkHttpMethod,
} from "../functions/lib/validators";

const handler: Handler = async (event, context) => {
  const logPrefix = "[deleteUser]";

  const methodResponse = checkHttpMethod(event.httpMethod, "DELETE", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  await connectToDB();

  try {
    const { identity, user } = context.clientContext!;
    const userID = user!.sub;
    const email = user!.email;
    const userUrl = `${identity!.url}/admin/users/{${userID}}`;
    const adminAuthHeader = `Bearer ${identity!.token}`;

    const foundUser = await UserData.findOne({
      email,
      account: "active",
    }).exec();
    if (!foundUser) {
      console.warn(`[deleteUser] User not found: ${email}`);
      return jsonResponse(404, { message: "User not found" });
    }

    const response = await fetch(userUrl, {
      method: "DELETE",
      headers: { Authorization: adminAuthHeader },
    });
    if (!response.ok) {
      console.warn(
        `${logPrefix} Failed to delete user from identity: ${response.status} - ${response.statusText}`
      );
      return jsonResponse(response.status, { message: response.statusText });
    }

    const updateResult = await UserData.updateOne(
      { email },
      { account: "deleted" }
    );
    if (updateResult.modifiedCount === 0) {
      console.warn(
        `${logPrefix} Failed to update user account to 'deleted': ${email}`
      );
      return jsonResponse(500, { message: "Failed to delete user" });
    }

    return jsonResponse(204, { message: "User deleted successfully" });
  } catch (error) {
    logError("Failed to delete user", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

module.exports = { handler };
