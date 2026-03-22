import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { jsonResponse, logError } from "./lib/response";
import { checkClientContext, checkHttpMethod } from "./lib/validators";
import { connectToDB } from "../config/mongoose";
import NotificationModel from "../models/Notification";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const logPrefix = "[cancelNotification]";

  const methodResponse = checkHttpMethod(event.httpMethod, "DELETE", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  try {
    const notificationId = event.queryStringParameters?.id;
    if (!notificationId) {
      return jsonResponse(400, { message: "Missing notification id" });
    }

    console.log(`${logPrefix} Cancelling notification in DB: ${notificationId}`);
    
    await connectToDB();

    try {
      // Szukamy i usuwamy po ObjectId przysłanym z frontendu
      const deletedDoc = await NotificationModel.findByIdAndDelete(notificationId);

      if (!deletedDoc) {
        console.log(`${logPrefix} Notification not found, treating as already processed/cancelled.`);
        return jsonResponse(200, { 
          success: true, 
          message: "Notification already processed or not found" 
        });
      }

      return jsonResponse(200, { success: true, message: "Notification cancelled" });
    } catch (err: any) {
      throw err; // Inne błędy rzucamy dalej do głównego catcha
    }
  } catch (err: any) {
    logError("Failed to cancel notification in DB", err, logPrefix);
    return jsonResponse(500, { 
      message: "Internal server error",
      error: err.response?.data || err.message
    });
  }
};
