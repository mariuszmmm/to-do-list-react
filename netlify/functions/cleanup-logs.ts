import { Handler } from "@netlify/functions";
import SystemConfig from "../models/SystemConfig";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../functions/lib/response";
import { publishSystemLog } from "../functions/lib/ablyHelper";

const handler: Handler = async (event) => {
  const logPrefix = "[cleanup-logs]";
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
        key: `log_cleanup_logs_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });

      // Notify admins in real-time
      await publishSystemLog({
        key: "log_cleanup_logs",
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

    // 1. Fetch all logs sorted by updatedAt descending
    const allLogs = await SystemConfig.find({
      key: /^log_/,
    }).sort({ updatedAt: -1 });

    console.log(`${logPrefix} Found ${allLogs.length} total logs.`);

    if (allLogs.length <= 10) {
      const msg = "10 or fewer logs found, skipping cleanup.";
      console.log(`${logPrefix} ${msg}`);
      await updateStatus("success", msg, {
        totalBefore: allLogs.length,
        deleted: 0,
      });
      return jsonResponse(200, {
        message: msg,
        data: { deletedCount: 0 },
      });
    }

    // 2. Identify logs to potentially delete (all except top 10)
    const logsToConsider = allLogs.slice(10);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const logsToDelete = logsToConsider.filter((log) => {
      const logDate = new Date(log.updatedAt);
      return logDate < twentyFourHoursAgo;
    });

    console.log(
      `${logPrefix} Logs considered for deletion: ${logsToConsider.length}`,
    );
    console.log(`${logPrefix} Logs older than 24h: ${logsToDelete.length}`);

    if (logsToDelete.length === 0) {
      const msg = "No logs older than 24h found (beyond the newest 10).";
      console.log(`${logPrefix} ${msg}`);
      await updateStatus("success", msg, {
        totalBefore: allLogs.length,
        deleted: 0,
      });
      return jsonResponse(200, {
        message: msg,
        data: { deletedCount: 0 },
      });
    }

    // 3. Perform deletion
    const idsToDelete = logsToDelete.map((log) => log._id);
    const deleteResult = await SystemConfig.deleteMany({
      _id: { $in: idsToDelete },
    });

    const msg = `Successfully deleted ${deleteResult.deletedCount} old logs.`;
    console.log(`${logPrefix} ${msg}`);

    await updateStatus("success", msg, {
      totalBefore: allLogs.length,
      deleted: deleteResult.deletedCount,
      remaining: allLogs.length - deleteResult.deletedCount,
    });

    return jsonResponse(200, {
      message: "Cleanup completed",
      data: { deletedCount: deleteResult.deletedCount },
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
