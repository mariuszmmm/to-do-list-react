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
      userEmail,
      heading,
      buttonText,
      listName,
      lang,
      displayImage,
    } = JSON.parse(event.body || "{}");

    if (!subscriptionId) {
      return jsonResponse(400, { message: "Missing subscriptionId payload" });
    }

    const labels = {
      pl: {
        heading: "Przypomnienie",
        list: "Lista",
        button: "Pokaż listę",
        subject: "🔔 Przypomnienie o zadaniu",
      },
      en: {
        heading: "Reminder",
        list: "List",
        button: "Show list",
        subject: "🔔 Task Reminder",
      },
      de: {
        heading: "Erinnerung",
        list: "Liste",
        button: "Liste anzeigen",
        subject: "🔔 Aufgaben-Erinnerung",
      },
    };

    const currLang = (lang as "en" | "de" | "pl") || "pl";
    const currentLabels = labels[currLang] || labels.pl;

    let finalContent = content;

    const emailSubject = currentLabels.subject;
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
            .wrapper { background-color: #f4f7f6; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(49, 38, 38, 0.1); }
            .header { background: #007380; padding: 30px 20px; text-align: center; }
            .header img { height: 50px; margin-bottom: 10px; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 40px 30px; text-align: left; }
            .content h2 { margin-top: 0; font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .list-name { color: #888; font-size: 14px; margin-bottom: 15px; }
            .task-text { font-size: 17px; color: #444; background: #f9f9f9; padding: 20px; border-left: 4px solid #007380; border-radius: 4px; margin: 20px 0; white-space: pre-wrap; }
            .cta-box { text-align: center; margin: 30px 0; }
            .button { background-color: #007380; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background 0.3s; }
            .task-image-container { margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 30px; }
            .task-image { max-width: 100%; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .footer { background: #fafafa; padding: 20px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <img src="https://to-do-list.myprojects.pl/logo-256x256.png" alt=" Logo">
                <h1>To-Do List</h1>
              </div>
              <div class="content">
                <h2>${heading || currentLabels.heading}</h2>
                ${listName ? `<div class="list-name"><strong>${listName}</strong></div>` : ""}
                <div class="task-text">${content}</div>
                
                <div class="cta-box">
                  <a href="https://to-do-list.myprojects.pl" class="button">${buttonText || currentLabels.button}</a>
                </div>

                ${
                  displayImage
                    ? `
                    <div class="task-image-container">
                      <p style="color: #888; font-size: 14px; margin-bottom: 15px;">Załączone zdjęcie zadania:</p>
                      <img src="${displayImage}" class="task-image" />
                    </div>
                    `
                    : ""
                }
              </div>
              <div class="footer">
                Wysłano z aplikacji To-Do List.<br>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    if (finalContent.length > 300) {
      finalContent = finalContent.substring(0, 300) + "...";
    }

    console.log(
      `${logPrefix} Scheduling Push (${subscriptionId}) and Email (${userEmail || "not provided"})`,
    );

    // 1. Wysyłka PUSH (Natywna - po Subscription ID)
    const pushPromise = axios.post(
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
        include_subscription_ids: [subscriptionId],
        data: { taskId, listName, userEmail },
        web_push_topic: taskId,
        persist: true,
        chrome_web_icon: "https://to-do-list.myprojects.pl/logo-256x256.png",
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

    // 2. Wysyłka EMAIL (Natywna - po Email Token/Address)
    let emailPromise: Promise<any> = Promise.resolve(null);
    if (userEmail) {
      emailPromise = axios
        .post(
          "https://onesignal.com/api/v1/notifications",
          {
            app_id: ONESIGNAL_APP_ID,
            include_email_tokens: [userEmail],
            email_subject: emailSubject,
            email_body: emailBody,
            send_after: date,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
            },
          },
        )
        .catch((err) => {
          console.warn(
            `${logPrefix} Email send failed, but continuing:`,
            err.response?.data || err.message,
          );
          return null;
        });
    }

    const [pushResponse] = await Promise.all([pushPromise, emailPromise]);

    return jsonResponse(200, {
      message: "Notification scheduled",
      notificationId: pushResponse.data.id || "",
      recipients: pushResponse.data.recipients || 0,
      onesignalResponse: pushResponse.data,
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
