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
  const logPrefix = "[getScheduledNotifications]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return jsonResponse(500, { message: "Missing OneSignal configuration" });
  }

  try {
    const masterId = event.queryStringParameters?.masterId;
    if (!masterId) {
      return jsonResponse(400, { message: "Missing masterId" });
    }

    console.log(`${logPrefix} Fetching notifications for masterId: ${masterId}`);

    const response = await axios.get(
      `https://onesignal.com/api/v1/notifications?app_id=${ONESIGNAL_APP_ID}&limit=50&kind=1`,
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    // OneSignal API nie pozwala na łatwe filtrowanie po aliasie w liście,
    // więc filtrujemy lokalnie po danych załączonych do powiadomienia (data.masterId).
    // Dodatkowo odfiltrowujemy powiadomienia, których czas wysyłki minął (starsze niż 5 min),
    // aby nie pokazywać "wiszących" lub już wysłanych zadań.
    const nowSeconds = Math.floor(Date.now() / 1000);
    const notifications = response.data.notifications || [];
    const userNotifications = notifications
      .filter((n: any) => {
        const isUserNotif = n.data?.masterId === masterId;
        // Zostawiamy TYLKO te, które są w przyszłości
        const isFuture = n.send_after > nowSeconds; 
        // WYKLUCZAMY anulowane powiadomienia
        const isNotCanceled = !n.canceled;
        // WYKLUCZAMY już wysłane (completed_at jest ustawiane po wysłaniu)
        const isNotSent = !n.completed_at;
        
        return isUserNotif && isFuture && isNotCanceled && isNotSent;
      })
      .map((n: any) => ({
        id: n.id,
        content: n.contents?.en || n.contents?.pl || Object.values(n.contents || {})[0],
        heading: n.headings?.en || n.headings?.pl || Object.values(n.headings || {})[0],
        send_after: n.send_after,
        data: n.data,
      }));

    return jsonResponse(200, userNotifications);
  } catch (err: any) {
    logError("Failed to fetch scheduled notifications", err, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};
