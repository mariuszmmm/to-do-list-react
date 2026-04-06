import { Handler } from "@netlify/functions";
import { jsonResponse, logError } from "../shared/lib/response";
import { checkClientContext, checkHttpMethod } from "../shared/lib/validators";
import { connectToDB } from "../config/mongoose";
import NotificationModel from "../models/Notification";

// Zmienne środowiskowe
const ONESIGNAL_APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

const handler: Handler = async (event, context) => {
  const logPrefix = '[notification-schedule]';

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return jsonResponse(500, { message: "Missing OneSignal configuration" });
  }

  try {
    const {
      taskId,
      content,
      date,
      subscriptionId,
      userEmail,
      heading,
      buttonText,
      listName,
      lang,
      displayImage,
    } = JSON.parse(event.body || "{}");

    if (!userEmail) {
      return jsonResponse(400, { message: "Missing userEmail payload" });
    }

    if (!date) {
      return jsonResponse(400, { message: "Missing date payload" });
    }

    // Connect to database
    await connectToDB();

    const dateObject = new Date(date);
    const sendAfterTimestamp = Math.floor(dateObject.getTime() / 1000);

    console.log(
      `${logPrefix} Scheduling notification in DB for user ${userEmail} at ${date}`,
    );

    // Utworzenie dokumentu w bazie danych (Single Source of Truth)
    const newNotification = new NotificationModel({
      userEmail,
      subscriptionId,
      taskId,
      listName,
      content,
      heading,
      buttonText,
      lang: lang || "pl",
      displayImage,
      send_after: sendAfterTimestamp,
      status: "pending",
    });

    const savedDoc = await newNotification.save();

    return jsonResponse(200, {
      message: "Notification scheduled in database",
      notificationId: savedDoc._id.toString(), // Zwracamy MongoDB _id!
      db_id: savedDoc._id.toString(),
    });
  } catch (error: any) {
    logError("Failed to schedule notification in DB", error, logPrefix);
    return jsonResponse(error.response?.status || 500, {
      message: error.message || "Internal Server Error",
    });
  }
};

export { handler };
