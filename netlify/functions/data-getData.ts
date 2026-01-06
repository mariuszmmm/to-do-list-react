import type { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { checkClientContext, checkHttpMethod } from "../utils/validators";
import { jsonResponse, logError } from "../utils/response";
import { mapListsToResponse } from "../utils/mapListsToResponse";

const handler: Handler = async (event, context) => {
  const logPrefix = "[getData]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  await connectToDB();

  try {
    const email = context.clientContext?.user.email as string;

    let foundUser = await UserData.findOne({ email, account: "active" }).exec();

    if (!foundUser) {
      console.warn(
        `${logPrefix} User not found in DB, creating empty record: ${email}`
      );
      foundUser = await UserData.create({
        email,
        account: "active",
        lists: [],
      });
    }

    const lists = mapListsToResponse(foundUser.lists);

    return jsonResponse(200, {
      message: "User data found",
      data: { lists },
    });
  } catch (error) {
    logError("Error fetching user data", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
