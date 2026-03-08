import { getBackupFileName } from "./getBackupFileName";
import { BackupData, BackupType } from "../../../src/types";
import UserData from "../../models/UserData";
import SystemConfig from "../../models/SystemConfig";

export const getAllUsersForBackup = async (email: string) => {
  const allUserData = await UserData.find({});
  const allSystemConfig = await SystemConfig.find({});

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
    version: "1.0",
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
    totalUsers: allUserData.length,
    totalLists,
    totalTasks,
  };

  return { backupData, fileName };
};
