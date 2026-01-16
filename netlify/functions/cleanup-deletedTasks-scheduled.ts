import { schedule } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../functions/lib/response";

const handler = schedule("*/30 * * * *", async () => {
  const logPrefix = "[cleanup-deletedTasks-scheduled]";

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
      }
    );

    return jsonResponse(200, {
      message: "Scheduled cleanup completed",
      data: { modifiedCount: updateResult.modifiedCount },
    });
  } catch (error) {
    logError("Scheduled cleanup failed", error, logPrefix);
    return jsonResponse(500, { message: "Scheduled cleanup failed" });
  }
});

export { handler };
