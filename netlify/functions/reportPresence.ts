// Netlify function: report presence from frontend
import type { Handler } from "@netlify/functions";

// In-memory store for demo (use DB in production)
let activeUsers: Record<string, number> = {};

const handler: Handler = async (event) => {
  if (event.httpMethod === "POST") {
    const { userId } = JSON.parse(event.body || "{}");
    if (userId) {
      activeUsers[userId] = Date.now();
      return {
        statusCode: 200,
        body: `User ${userId} reported as active.`,
      };
    }
    return {
      statusCode: 400,
      body: "Missing userId",
    };
  }
  // Clean up users not seen in last 2 min
  const now = Date.now();
  Object.keys(activeUsers).forEach((id) => {
    if (now - activeUsers[id] > 120000) delete activeUsers[id];
  });
  return {
    statusCode: 200,
    body: `Active users: ${Object.keys(activeUsers).length}`,
  };
};

module.exports = { handler };
