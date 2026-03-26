import mongoose from "mongoose";
import { getBackupFileName } from "./getBackupFileName";
import { BackupData, BackupType } from "../../../src/types";
import UserData from "../../models/UserData";
import SystemConfig from "../../models/SystemConfig";
import NotificationModel from "../../models/Notification";

export const getAllUsersForBackup = async (email: string) => {
  if (!mongoose.connection.db) {
    throw new Error("Database not connected");
  }

  const allUserData = await UserData.find({});
  const allSystemConfig = await SystemConfig.find({});
  const allNotifications = await NotificationModel.find({});

  // Dynamic dump of all collections (like the manual script)
  const collectionsData: Record<string, any[]> = {};
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    const docs = await mongoose.connection.db
      .collection(col.name)
      .find({})
      .toArray();
    collectionsData[col.name] = docs;
  }

  if (!allUserData || allUserData.length === 0) {
    throw new Error("No user data found");
  }

  let totalLists = 0;
  let totalTasks = 0;

  allUserData.forEach((userData: any) => {
    totalLists += userData.lists?.length || 0;
    userData.lists?.forEach((list: any) => {
      totalTasks += list.taskList?.length || 0;
    });
  });

  const now = new Date();
  const backupType: BackupType = "all-users";
  const fileName = getBackupFileName(backupType, now);

  const backupData: BackupData = {
    version: "1.1", // Increment version for new field support
    timestamp: now.toISOString(),
    createdBy: email,
    fileName,
    backupType,
    users: allUserData.map((userData: any) => ({
      email: userData.email,
      account: userData.account,
      googleRefreshToken: userData.googleRefreshToken,
      lists: (userData.lists || []).map((list: any) =>
        typeof list.toObject === "function" ? list.toObject() : list,
      ),
      listsCount: userData.lists?.length || 0,
      tasksCount:
        userData.lists?.reduce(
          (sum: number, list: any) => sum + (list.taskList?.length || 0),
          0,
        ) || 0,
    })),
    systemSettings: allSystemConfig
      .filter((config: any) => config.key && !config.key.startsWith("log_"))
      .map((config: any) => ({
        key: config.key,
        value: config.value,
        updatedAt:
          config.updatedAt instanceof Date
            ? config.updatedAt.toISOString()
            : new Date().toISOString(),
      })),
    systemLogs: allSystemConfig
      .filter((config: any) => config.key && config.key.startsWith("log_"))
      .map((config: any) => ({
        key: config.key,
        value: config.value,
        updatedAt:
          config.updatedAt instanceof Date
            ? config.updatedAt.toISOString()
            : new Date().toISOString(),
      })),
    notifications: allNotifications.map((notif) =>
      typeof notif.toObject === "function" ? notif.toObject() : notif,
    ),
    collections: collectionsData,
    totalUsers: allUserData.length,
    totalLists,
    totalTasks,
  };

  return { backupData, fileName };
};
