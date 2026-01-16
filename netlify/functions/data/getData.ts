import { HandlerContext } from "@netlify/functions";
import UserData from "../../models/UserData";
import { mapListsToResponse } from "../lib/mapListsToResponse";
import { jsonResponse, logError } from "../lib/response";

export const getData = async (context: HandlerContext, logPrefix: string) => {
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
    // console.log("lists", lists);

    return jsonResponse(200, {
      message: "User data found",
      data: { lists },
    });
  } catch (error) {
    logError("Error fetching user data", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};
