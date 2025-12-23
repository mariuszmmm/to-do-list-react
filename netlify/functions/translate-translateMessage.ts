import type { Handler, HandlerEvent } from "@netlify/functions";
import { checkEventBody, checkHttpMethod } from "../utils/validators";
import { jsonResponse, logError } from "../utils/response";

const handler: Handler = async (event: HandlerEvent) => {
  const logPrefix = "[translateMessage]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const KEY = process.env.TRANSLATION_API_KEY;
  const API_URL = process.env.TRANSLATION_API_URL;

  if (!KEY) {
    logError(
      "Missing translation API key",
      new Error("Missing environment variable"),
      logPrefix
    );
    return jsonResponse(500, { message: "Missing translation API key" });
  }

  let response;
  try {
    const body = event.body as string;
    let parsedBody: { text?: string; targetLanguage?: string };

    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, { message: "Invalid JSON in request body" });
    }

    const { text, targetLanguage } = parsedBody;

    const apiRes = await fetch(`${API_URL}?key=${KEY}`, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLanguage,
        format: "text",
      }),
    });
    if (!apiRes.ok) {
      console.warn(
        `${logPrefix} Translation API error: ${apiRes.status} ${apiRes.statusText}`
      );
      throw new Error(apiRes.statusText);
    }
    response = await apiRes.json();
  } catch (err) {
    logError("Error fetching translation", err, logPrefix);
    return jsonResponse(500, { message: "Error fetching translation" });
  }

  const translatedText = response?.data?.translations?.[0]?.translatedText;

  return jsonResponse(200, {
    message: "Translation successful",
    translatedText,
  });
};

export { handler };
