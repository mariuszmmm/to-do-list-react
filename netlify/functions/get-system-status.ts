import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import SystemConfig from "../models/SystemConfig";
import UserData from "../models/UserData";
import { jsonResponse, logError } from "./lib/response";
import { getCloudinaryUsage } from "./lib/cloudinaryHelper";
import { getNetlifyUsage } from "./lib/netlifyHelper";
import {
  checkClientContext,
  checkAdminRole,
  checkHttpMethod,
} from "./lib/validators";
import mongoose from "mongoose";

const handler: Handler = async (event, context) => {
  const logPrefix = "[getSystemStatus]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  try {
    await connectToDB();

    const status = await SystemConfig.findOne({ key: "lastAutoBackupStatus" });
    const lastCleanupStatus = await SystemConfig.findOne({
      key: "lastOrphanCleanupStatus",
    });

    // Database statistics
    const allUsers = await UserData.find({ account: "active" }).exec();
    let totalLists = 0;
    let totalTasks = 0;

    allUsers.forEach((user) => {
      totalLists += user.lists?.length || 0;
      user.lists?.forEach((list: any) => {
        totalTasks += list.taskList?.length || 0;
      });
    });

    // Fetch last 5 entries from SystemConfig that are history logs
    const allConfigs = await SystemConfig.find({
      key: /^log_/,
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    const logs = allConfigs.map((config) => ({
      key: config.key,
      status: (config.value as any)?.status,
      details: (config.value as any)?.details,
      timestamp: config.updatedAt,
      stats: (config.value as any)?.stats,
    }));

    // Fetch Cloudinary usage
    const storageStats = await getCloudinaryUsage();

    // Fetch Netlify usage
    const netlifyStats = await getNetlifyUsage();

    // Database Size Stats
    let dbSizeStats = null;
    try {
      if (mongoose.connection.db) {
        const stats = await (mongoose.connection.db as any).stats();
        dbSizeStats = {
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          indexSize: stats.indexSize,
          collections: stats.collections,
        };
      }
    } catch (dbErr) {
      console.warn("[getSystemStatus] Failed to fetch DB stats:", dbErr);
    }

    return jsonResponse(200, {
      status: status ? status.value : { status: "unknown" },
      cleanupStatus: lastCleanupStatus
        ? lastCleanupStatus.value
        : { status: "unknown" },
      stats: {
        totalUsers: allUsers.length,
        totalLists,
        totalTasks,
        dbSize: dbSizeStats,
      },
      storageStats,
      netlifyStats,
      logs,
    });
  } catch (error) {
    logError("Error fetching system status", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
