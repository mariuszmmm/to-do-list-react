import { Handler } from "@netlify/functions";
import axios from "axios";
import { jsonResponse, logError } from "./lib/response";
import { checkClientContext, checkHttpMethod } from "./lib/validators";

// Zmienne środowiskowe
const ONESIGNAL_APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

const handler: Handler = async (event, context) => {
  const logPrefix = "[scheduleNotification]";

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
      heading,
      buttonText,
      listName,
      lang,
    } = JSON.parse(event.body || "{}");

    if (!subscriptionId) {
      return jsonResponse(400, { message: "Missing subscriptionId payload" });
    }

    const labels = {
      pl: { heading: "Przypomnienie", list: "Lista", button: "Pokaż listę" },
      en: { heading: "Reminder", list: "List", button: "Show list" },
      de: { heading: "Erinnerung", list: "Liste", button: "Liste anzeigen" },
    };

    const currLang = (lang as "en" | "de" | "pl") || "pl";
    const currentLabels = labels[currLang] || labels.pl;

    const finalContent = listName
      ? `${currentLabels.list}: ${listName}\n${content}`
      : content;

    console.log(
      `${logPrefix} Sending to OneSignal targeted Subscription: ${subscriptionId}`,
    );

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        headings: {
          pl:
            currLang === "pl"
              ? heading || labels.pl.heading
              : labels.pl.heading,
          en:
            currLang === "en"
              ? heading || labels.en.heading
              : labels.en.heading,
          de:
            currLang === "de"
              ? heading || labels.de.heading
              : labels.de.heading,
        },
        contents: {
          pl: finalContent,
          en: finalContent,
          de: finalContent,
        },
        send_after: date,
        target_channel: "push",
        // Skupiamy się WYŁĄCZNIE na ID subskrypcji konkretnego urządzenia.
        include_subscription_ids: [subscriptionId],
        data: { taskId },
        web_push_topic: taskId,
        persist: true,
        chrome_web_icon: "https://to-do-list.myprojects.pl/favicon-96x96.png",
        chrome_web_badge: "https://to-do-list.myprojects.pl/favicon-96x96.png",
        web_push_options: {
          requireInteraction: true,
        },
        buttons: [
          {
            id: "view-list",
            text: buttonText || currentLabels.button,
            icon: "",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      },
    );

    console.log(
      `${logPrefix} OneSignal Response:`,
      JSON.stringify(response.data, null, 2),
    );

    return jsonResponse(200, {
      message: "Notification scheduled",
      notificationId: response.data.id || "",
      recipients: response.data.recipients || 0,
      errors: response.data.errors,
      onesignalResponse: response.data,
      debugPayload: { subscriptionId },
    });
  } catch (error: any) {
    logError("Failed to schedule notification via OneSignal", error, logPrefix);
    return jsonResponse(error.response?.status || 500, {
      message: error.response?.data?.message || "Internal Server Error",
      errors: error.response?.data?.errors,
      details: error.response?.data,
    });
  }
};

export { handler };
