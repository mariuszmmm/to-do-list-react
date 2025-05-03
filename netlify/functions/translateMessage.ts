import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    console.error("Method Not Allowed");

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const KEY = process.env.TRANSLATION_API_KEY;
  const API_URL = process.env.TRANSLATION_API_URL;

  if (!KEY) {
    console.error("Missing TRANSLATION_API_KEY");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Missing TRANSLATION_API_KEY" }),
    };
  }

  if (!event.body) {
    console.error("No data");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No data" }),
    };
  }

  const { text, targetLanguage } = JSON.parse(event.body);

  const response = await fetch(`${API_URL}?key=${KEY}`, {
    method: "POST",
    body: JSON.stringify({
      q: text,
      source: "en",
      target: targetLanguage,
      format: "text",
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    })
    .catch((err) => {
      console.error("Error fetching translation", err);
      throw new Error("Error fetching translation");
    });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Translation successful",
      translatedText: response.data.translations[0].translatedText,
    }),
  };
};

module.exports = { handler };
