import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import axios from "axios";
import { jsonResponse, logError } from "./lib/response";
import { checkClientContext, checkHttpMethod } from "./lib/validators";

const ONESIGNAL_APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

/**
 * Funkcja pobierająca listę ZAPLANOWANYCH powiadomień z OneSignal.
 * OneSignal API nie oferuje bezpośredniego filtrowania po e-mailu w liście,
 * więc pobieramy paczkę ostatnich powiadomień i filtrujemy je lokalnie.
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

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return jsonResponse(500, { message: "Missing OneSignal configuration" });
  }

  try {
    const email = event.queryStringParameters?.email;
    if (!email) {
      return jsonResponse(400, { message: "Missing email" });
    }

    console.log(`${logPrefix} Fetching notifications for user: ${email}`);

    // Kind 1: Zaplanowane (Scheduled)
    const response = await axios.get(
      `https://onesignal.com/api/v1/notifications?app_id=${ONESIGNAL_APP_ID}&limit=50&kind=1`,
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    const nowSeconds = Math.floor(Date.now() / 1000);
    const notifications = response.data.notifications || [];
    
    // Filtrujemy listę, aby pokazać tylko powiadomienia tego użytkownika
    const userNotifications = notifications
      .filter((n: any) => {
        // Kluczowe filtrowanie po e-mailu zapisanym w meta-danych powiadomienia
        const isUserNotif = n.data?.userEmail === email;
        // Zostawiamy TYLKO te, które są zaplanowane w przyszłości
        const isFuture = n.send_after > nowSeconds; 
        // Wykluczamy anulowane
        const isNotCanceled = !n.canceled;
        // Wykluczamy już wysłane (completed_at jest niepuste po wysłaniu)
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
