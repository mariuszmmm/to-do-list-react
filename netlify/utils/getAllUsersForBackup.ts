import { getBackupFileName } from "./getBackupFileName";
import { BackupData } from "../../src/types";
import UserData from "../models/UserData";

export const getAllUsersForBackup = async (email: string) => {
  const allUserData = await UserData.find({ account: "active" });
  if (!allUserData || allUserData.length === 0) {
    throw new Error("No user data found");
  }

  let totalLists = 0;
  let totalTasks = 0;

  allUserData.forEach((userData) => {
    totalLists += userData.lists?.length || 0;
    userData.lists?.forEach((list: any) => {
      totalTasks += list.taskList?.length || 0;
    });
  });

  const now = new Date();
  const fileName = getBackupFileName("all-users-backup", now);

  const backupData: BackupData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    createdBy: email,
    fileName,
    backupType: "all-users-backup",
    users: allUserData.map((userData) => ({
      email: userData.email,
      account: userData.account,
      lists: (userData.lists || []).map((list: any) => ({
        ...list.toObject(),
      })),
      listsCount: userData.lists?.length || 0,
      tasksCount:
        userData.lists?.reduce(
          (sum: number, list: any) => sum + (list.taskList?.length || 0),
          0
        ) || 0,
    })),
    totalUsers: allUserData.length,
    totalLists,
    totalTasks,
  };

  return { backupData, fileName };
};
