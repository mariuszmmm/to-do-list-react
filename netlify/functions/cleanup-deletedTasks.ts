import { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import SystemConfig from "../models/SystemConfig";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../functions/lib/response";
import { publishSystemLog } from "../functions/lib/ablyHelper";

const handler: Handler = async (event) => {
  const logPrefix = "[cleanup-deletedTasks]";
  console.log(`${logPrefix} Function started. Method: ${event.httpMethod}`);

  if (event.httpMethod !== "POST") {
    console.warn(`${logPrefix} Method ${event.httpMethod} not allowed.`);
    return jsonResponse(405, { message: "Method not allowed" });
  }

  const updateStatus = async (
    status: "success" | "error",
    details?: string,
    stats?: any,
  ) => {
    try {
      await connectToDB();
      const timestamp = new Date().toISOString();
      const value = { status, details, stats, timestamp };

      // Add a unique log entry for the history list
      await SystemConfig.create({
        key: `log_cleanup_tasks_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });

      // Notify admins in real-time
      await publishSystemLog({
        key: "log_cleanup_tasks",
        status,
        details,
        timestamp,
        stats,
      });
    } catch (err) {
      console.error(`${logPrefix} Failed to update SystemConfig:`, err);
    }
  };

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

    await updateStatus("success", "Deleted tasks cleanup completed", {
      cleaned: updateResult.modifiedCount,
    });

    return jsonResponse(200, {
      message: "Cleanup completed",
      data: { modifiedCount: updateResult.modifiedCount },
    });
  } catch (error) {
    logError("Cleanup failed", error, logPrefix);
    await updateStatus(
      "error",
      error instanceof Error ? error.message : "Unknown error",
    );
    return jsonResponse(500, { message: "Cleanup failed" });
  }
};

export { handler };
