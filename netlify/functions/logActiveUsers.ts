// // Netlify function: log number of active users (presence) on Ably channel
// import type { Handler } from "@netlify/functions";
// import Ably from "ably";

// const ABLY_API_KEY = process.env.ABLY_API_KEY;
// const PRESENCE_CHANNEL = "account:presence";

// const handler: Handler = async (event) => {
//   console.log("[logActiveUsers] logActiveUsers function called");
//   if (!ABLY_API_KEY) {
//     console.log("Ably API key not configured");
//     return {
//       statusCode: 500,
//       body: "Ably API key not configured",
//     };
//   }

//   console.log("Connecting to Ably REST with key:", ABLY_API_KEY);
//   const ably = new Ably.Rest({ key: ABLY_API_KEY });
//   const channel = ably.channels.get(PRESENCE_CHANNEL);
//   console.log("Getting presence for channel:", PRESENCE_CHANNEL);

//   try {
//     const members = await new Promise<any[]>((resolve, reject) => {
//       (channel.presence.get as any)((err: any, result: any[]) => {
//         if (err) {
//           console.log("Error in channel.presence.get:", err);
//           return reject(err);
//         }
//         console.log("Presence members result:", result);
//         resolve(Array.isArray(result) ? result : []);
//       });
//     });
//     console.log(`Active users (presence): ${members.length}`);
//     return {
//       statusCode: 200,
//       body: `Active users: ${members.length}`,
//     };
//   } catch (error) {
//     console.log("Failed to get presence", error);
//     return {
//       statusCode: 500,
//       body: "Failed to get presence",
//     };
//   }
// };

// module.exports = { handler };
