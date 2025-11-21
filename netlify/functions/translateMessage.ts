// Netlify function to translate text using external API
import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  // Entry log
  console.log("Translation function invoked");

  // Only allow POST method
  if (event.httpMethod !== "POST") {
    console.error("Method Not Allowed");
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Get API key and URL from environment
  const KEY = process.env.TRANSLATION_API_KEY;
  const API_URL = process.env.TRANSLATION_API_URL;

  if (!KEY) {
    console.error("Missing TRANSLATION_API_KEY");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Missing TRANSLATION_API_KEY" }),
    };
  }

  // Validate request body
  if (!event.body) {
    console.error("No data");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No data" }),
    };
  }

  // Parse request data
  const { text, targetLanguage } = JSON.parse(event.body);
  console.log(`Translating text to ${targetLanguage}:`, text);

  // Call translation API
  let response;
  try {
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
      console.error("Translation API error:", apiRes.status, apiRes.statusText);
      throw new Error(apiRes.statusText);
    }
    response = await apiRes.json();
  } catch (err) {
    console.error("Error fetching translation", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching translation" }),
    };
  }

  // Log and return translation
  const translatedText = response?.data?.translations?.[0]?.translatedText;
  console.log("Translation successful:", translatedText);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Translation successful",
      translatedText,
    }),
  };
};

// Export handler
module.exports = { handler };
