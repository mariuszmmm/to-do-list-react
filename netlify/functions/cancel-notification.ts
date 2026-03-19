import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import axios from "axios";
import { jsonResponse, logError } from "./lib/response";
import { checkClientContext, checkHttpMethod } from "./lib/validators";

const ONESIGNAL_APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const logPrefix = "[cancelNotification]";

  const methodResponse = checkHttpMethod(event.httpMethod, "DELETE", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return jsonResponse(500, { message: "Missing OneSignal configuration" });
  }

  try {
    const notificationId = event.queryStringParameters?.id;
    if (!notificationId) {
      return jsonResponse(400, { message: "Missing notification id" });
    }

    console.log(`${logPrefix} Cancelling notification: ${notificationId}`);
    
    try {
      const response = await axios.delete(
        `https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`,
        {
          headers: {
            Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
          },
        }
      );

      return jsonResponse(200, { success: true, data: response.data });
    } catch (err: any) {
      // Jeśli powiadomienie zostało już wysłane lub nie istnieje (400/404), 
      // traktujemy to jako sukces aplikacji (i tak zostanie usunięte z listy po odświeżeniu)
      if (err.response?.status === 400 || err.response?.status === 404) {
        console.log(`${logPrefix} Notification already processed or not found, treating as success.`);
        return jsonResponse(200, { 
          success: true, 
          message: "Notification already processed or not found",
          onesignalError: err.response.data
        });
      }
      throw err; // Inne błędy rzucamy dalej do głównego catcha
    }
  } catch (err: any) {
    logError("Failed to cancel notification", err, logPrefix);
    return jsonResponse(500, { 
      message: "Internal server error",
      error: err.response?.data || err.message
    });
  }
};
