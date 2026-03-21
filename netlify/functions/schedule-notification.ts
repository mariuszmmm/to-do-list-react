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
        button: "Otwórz aplikację",
        subject: "🔔 Przypomnienie o zadaniu",
      },
      en: {
        heading: "Reminder",
        list: "List",
        button: "Open app",
        subject: "🔔 Task Reminder",
      },
      de: {
        heading: "Erinnerung",
        list: "Liste",
        button: "App öffnen",
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
            @media screen and (max-width: 620px) {
              body { margin: 8px !important; }	
              .outer-table { padding: 0 0 100px 0 !important; }
              .inner-header { padding: 20px 15px !important; }
              .inner-body { padding: 12px 16px 0 16px !important; }
              .inner-divider { padding: 0 20px !important; }
              .inner-footer { padding: 15px 20px 24px 20px !important; }
              h2 { font-size: 18px !important; }
              .responsive-text { font-size: 14px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table class="outer-table" style="padding: 20px 0 150px 0; background-color: #f4f7f6;" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td align="center">
                  <table style="background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); width: 100%; max-width: 600px;" width="620" cellspacing="0" cellpadding="0">
                    <!-- HEADER -->
                    <tbody>
                      <tr>
                        <td class="inner-header" style="background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%); padding: 28px 36px; text-align: center;">
                          <a href="https://to-do-list.myprojects.pl" target="_blank" style="text-decoration: none; display: inline-block">
                            <img style="height: 60px; width: auto; border-radius: 12px; display: block; margin: 0 auto 12px auto;" 
                                 src="https://to-do-list.myprojects.pl/web-app-manifest-192x192.png" alt="To-Do List Logo" />
                          </a>
                          <p style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; font-family: arial, helvetica, sans-serif">
                            <span>To-Do List</span>
                          </p>
                          <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">
                            <a href="https://to-do-list.myprojects.pl" target="_blank" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">
                              <i style="font-family: arial, helvetica, sans-serif">to-do-list.myprojects.pl</i>
                            </a>
                          </p>
                        </td>
                      </tr>
                      <!-- TREŚĆ -->
                      <tr>
                        <td class="inner-body" style="padding: 28px 24px 0 24px">
                          <h2 style="margin: 0 0 20px 0; color: #1a73e8; font-size: 22px; font-weight: bold;">
                            ${heading || currentLabels.heading}
                          </h2>
                          
                          ${
                            listName
                              ? `<p class="responsive-text" style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                            <strong>${listName}</strong>
                          </p>`
                              : ""
                          }
                          
                          <table style="margin: 0 0 32px 0" width="100%" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td style="background-color: #f8faff; border-left: 4px solid #1a73e8; border-radius: 0 8px 8px 0; padding: 16px 20px;">
                                  <p style="margin: 0 0 6px 0; color: #1a73e8; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                    Zadanie
                                  </p>
                                  <p class="responsive-text" style="margin: 0; color: #555555; font-size: 16px; line-height: 1.6; font-style: italic; white-space: pre-wrap;">${content}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <div style="text-align: center; margin: 30px 0;">
                            <a href="https://to-do-list.myprojects.pl" style="background-color: #1a73e8; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background 0.3s;">
                              ${buttonText || currentLabels.button}
                            </a>
                          </div>

                          ${
                            displayImage
                              ? `
                              <table style="margin: 0 0 32px 0; width: 100%; text-align: center;" cellspacing="0" cellpadding="0">
                                <tbody>
                                  <tr>
                                    <td style="border-top: 1px solid #e8edf2; padding-top: 30px;">
                                      <p style="margin: 0 0 15px 0; color: #888; font-size: 14px;">Załączone zdjęcie zadania:</p>
                                      <img src="${displayImage}" style="max-width: 100%; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              `
                              : ""
                          }
                        </td>
                      </tr>
                      <!-- DIVIDER -->
                      <tr>
                        <td class="inner-divider" style="padding: 0 40px">
                          <hr style="border: none; border-top: 1px solid #e8edf2; margin: 0" />
                        </td>
                      </tr>
                      <!-- FOOTER -->
                      <tr>
                        <td class="inner-footer" style="padding: 24px 40px 36px 40px; text-align: center">
                          <p style="margin: 0; color: #aaaaaa; font-size: 11px; line-height: 1.6;">
                            Wysłano z aplikacji To-Do List.<br>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
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
        url: "https://to-do-list.myprojects.pl",
        web_push_topic: taskId,
        persist: true,
        chrome_web_icon: "https://to-do-list.myprojects.pl/logo-256x256.png",
        chrome_web_badge: "https://to-do-list.myprojects.pl/favicon-96x96.png",
        ...(displayImage && { chrome_web_image: displayImage }),
        web_push_options: {
          requireInteraction: true,
        },
        buttons: [
          {
            id: "view-list",
            text: buttonText || currentLabels.button,
            icon: "",
            url: "https://to-do-list.myprojects.pl",
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
