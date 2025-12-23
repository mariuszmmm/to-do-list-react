import UserData, { UserDoc } from "../models/UserData";
import type { HandlerResponse } from "@netlify/functions";
import { jsonResponse, logError } from "./response";

export const findActiveUser = async (
  email: string,
  logPrefix = "[findActiveUser]"
): Promise<HandlerResponse | UserDoc> => {
  try {
    const foundUser = await UserData.findOne({
      email,
      account: "active",
    }).exec();

    if (!foundUser) {
      console.warn(`${logPrefix} User not found for email`);
      return jsonResponse(404, { message: "User not found" });
    }

    return foundUser;
  } catch (e) {
    logError("Error finding user", e, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};
