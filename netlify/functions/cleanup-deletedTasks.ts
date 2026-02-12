import { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../functions/lib/response";

const handler: Handler = async (event) => {
  const logPrefix = "[cleanup-deletedTasks]";

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { message: "Method not allowed" });
  }

  try {
    await connectToDB();

    const timedOutMs = 1000 * 60 * 5; // 5 minutes
    const cutoffIso = new Date(Date.now() - timedOutMs).toISOString();

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
