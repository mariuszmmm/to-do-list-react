import { nanoid } from "nanoid";
import UserData from "../models/UserData";
import { publishAblyUpdate } from "../config/ably";
import { BackupData, List, Task } from "../../src/types";

export const restoreAllUsersFromBackupData = async (
  backupData: BackupData
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
        (list: List & { taskList: Task[] }) => ({
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
        })
      );

      await UserData.findOneAndUpdate(
        { email: user.email },
        {
          email: user.email,
          account: user.account || "active",
          lists: normalizedLists,
        },
        { upsert: true, new: true }
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

  return { restored, failed };
};
