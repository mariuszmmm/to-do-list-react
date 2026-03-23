import { HandlerContext } from "@netlify/functions";
import UserData from "../../models/UserData";
import { mapListsToResponse } from "../lib/mapListsToResponse";
import { jsonResponse, logError } from "../lib/response";

export const getData = async (context: HandlerContext, logPrefix: string) => {
  try {
    const email = context.clientContext?.user.email as string;

    let foundUser = await UserData.findOne({ email }).exec();

    if (!foundUser) {
      foundUser = await UserData.create({
        email,
        account: "active",
        lists: [],
      });
    } else if (foundUser.account === "deleted" || foundUser.account === "pending") {
      console.warn(
        `${logPrefix} User account is ${foundUser.account}, activating: ${email}`,
      );
      foundUser.account = "active";
      await foundUser.save();
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
