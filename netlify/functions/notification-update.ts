import { Handler } from "@netlify/functions";
import { jsonResponse, logError } from "../shared/lib/response";
import { checkClientContext, checkHttpMethod } from "../shared/lib/validators";
import { connectToDB } from "../config/mongoose";
import NotificationModel from "../models/Notification";

const handler: Handler = async (event, context) => {
  const logPrefix = '[notification-update]';

  const methodResponse = checkHttpMethod(event.httpMethod, "PUT", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  try {
    const { id, date } = JSON.parse(event.body || "{}");

    if (!id || !date) {
      return jsonResponse(400, { message: "Missing id or date payload" });
    }

    await connectToDB();

    const dateObject = new Date(date);
    const sendAfterTimestamp = Math.floor(dateObject.getTime() / 1000);

    console.log(`${logPrefix} Updating notification in DB: ${id} to ${date}`);

    const updatedDoc = await NotificationModel.findByIdAndUpdate(
      id,
      { send_after: sendAfterTimestamp, status: "pending" },
      { new: true }
    );

    if (!updatedDoc) {
      return jsonResponse(404, { message: "Notification not found" });
    }

    return jsonResponse(200, {
      message: "Notification updated in database",
      notificationId: updatedDoc._id.toString(),
      success: true
    });
  } catch (error: any) {
    logError("Failed to update notification in DB", error, logPrefix);
    return jsonResponse(500, {
      message: error.message || "Internal Server Error",
    });
  }
};

export { handler };
