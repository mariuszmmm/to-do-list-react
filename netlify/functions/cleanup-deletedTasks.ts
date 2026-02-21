import { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../functions/lib/response";

const handler: Handler = async (event) => {
  const logPrefix = "[cleanup-deletedTasks]";
  console.log(`${logPrefix} Function started. Method: ${event.httpMethod}`);

  if (event.httpMethod !== "POST") {
    console.warn(`${logPrefix} Method ${event.httpMethod} not allowed.`);
    return jsonResponse(405, { message: "Method not allowed" });
  }

  try {
    console.log(`${logPrefix} Connecting to database...`);
    await connectToDB();

    // const timedOutMs = 1000 * 60 * 60 * 24 * 7; // 7 days
    const timedOutMs = 1000 * 60 * 60; // 1 hour - TEST

    const cutoffIso = new Date(Date.now() - timedOutMs).toISOString();
    console.log(`${logPrefix} Cleaning up tasks deleted before: ${cutoffIso}`);

    const updateResult = await UserData.updateMany(
      { account: "active" },
      {
        $pull: {
          "lists.$[].deletedTasks": {
            deletedAt: { $lt: cutoffIso },
          },
        },
      },
    );

    console.log(
      `${logPrefix} Cleanup finished. Modified documents: ${updateResult.modifiedCount}`,
    );

    return jsonResponse(200, {
      message: "Cleanup completed",
      data: { modifiedCount: updateResult.modifiedCount },
    });
  } catch (error) {
    logError("Cleanup failed", error, logPrefix);
    return jsonResponse(500, { message: "Cleanup failed" });
  }
};

export { handler };
