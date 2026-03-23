import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { jsonResponse, logError } from "./lib/response";
import { checkClientContext, checkHttpMethod } from "./lib/validators";
import { connectToDB } from "../config/mongoose";
import NotificationModel from "../models/Notification";

/**
 * Funkcja pobierająca listę ZAPLANOWANYCH powiadomień z bazy MongoDB.
 */
export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const logPrefix = "[getScheduledNotifications]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  try {
    const email = event.queryStringParameters?.email;
    if (!email) {
      return jsonResponse(400, { message: "Missing email" });
    }

    console.log(`${logPrefix} Fetching notifications for user: ${email} from MongoDB`);

    await connectToDB();

    const nowSeconds = Math.floor(Date.now() / 1000);

    // Szukamy zaplanowanych powiadomień użytkownika
    const notifications = await NotificationModel.find({
      userEmail: email,
      status: "pending",
    }).lean();

    const userNotifications = notifications.map((n: any) => ({
      id: n._id.toString(), // Mapujemy MongoDB _id na pole id dla frontendu
      content: n.content,
      heading: n.heading,
      send_after: n.send_after,
      data: {
        userEmail: n.userEmail,
        listName: n.listName,
        taskId: n.taskId,
      },
    }));

    return jsonResponse(200, userNotifications as any);
  } catch (err: any) {
    logError("Failed to fetch scheduled notifications from DB", err, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};
