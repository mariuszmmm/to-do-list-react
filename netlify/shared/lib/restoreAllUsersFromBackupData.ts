import { nanoid } from "nanoid";
import UserData from "../../models/UserData";
import SystemConfig from "../../models/SystemConfig";
import { publishAblyUpdate } from "../../config/ably";
import { BackupData, List, Task } from "../../../src/types";

export const restoreAllUsersFromBackupData = async (
  backupData: BackupData,
): Promise<{ restored: number; failed: number }> => {
  let restored = 0;
  let failed = 0;

  if (!Array.isArray(backupData.users)) {
    throw new Error("Invalid or missing users array in backup data");
  }

  for (const user of backupData.users) {
    try {
      const userList = user.lists;
      if (!Array.isArray(userList)) {
        throw new Error("Invalid or missing lists for user: " + user.email);
      }

      const currentDate = new Date().toISOString();
      const normalizedLists: List[] = userList.map(
        (list: List & { taskList: Task[]; deletedTasks?: Task[] }) => ({
          id: list.id || nanoid(),
          name: list.name || "Untitled List",
          date: list.date || currentDate,
          updatedAt: list.updatedAt || currentDate,
          version: list.version || 0,
          taskList: Array.isArray(list.taskList)
            ? list.taskList.map((task: any) => ({
                ...task,
                id: task.id || nanoid(),
                content: task.content || "",
                done: typeof task.done === "boolean" ? task.done : false,
                date: task.date || currentDate,
                updatedAt: task.updatedAt || currentDate,
              }))
            : [],
          deletedTasks: Array.isArray(list.deletedTasks)
            ? list.deletedTasks.map((task: any) => ({
                ...task,
                id: task.id || nanoid(),
                content: task.content || "",
                done: typeof task.done === "boolean" ? task.done : false,
                date: task.date || currentDate,
                updatedAt: task.updatedAt || currentDate,
              }))
            : [],
        }),
      );

      await UserData.findOneAndUpdate(
        { email: user.email },
        {
          email: user.email,
          account: user.account || "active",
          googleRefreshToken: user.googleRefreshToken,
          lists: normalizedLists,
        },
        { upsert: true, returnDocument: "after" },
      );

      await publishAblyUpdate(user.email, {
        action: "restore",
        timestamp: new Date().toISOString(),
        lists: normalizedLists,
      });

      restored++;
    } catch (err) {
      console.error(`Failed to restore user: ${user.email}`, err);
      failed++;
    }
  }

  // Restore SystemConfig (Settings and Logs)
  const configsToRestore = [
    ...(backupData.systemSettings || []),
    ...(backupData.systemLogs || []),
  ];

  if (configsToRestore.length > 0) {
    for (const config of configsToRestore) {
      try {
        await SystemConfig.findOneAndUpdate(
          { key: config.key },
          {
            key: config.key,
            value: config.value,
            updatedAt: new Date(config.updatedAt),
          },
          { upsert: true },
        );
      } catch (err) {
        console.error(`Failed to restore SystemConfig: ${config.key}`, err);
      }
    }
  }

  return { restored, failed };
};
