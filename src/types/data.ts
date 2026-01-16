import { Version } from "./account";
import { List } from "./list";
import { Task } from "./task";

export type ExampleTasks = {
  name: string;
  tasks: Task[];
};

export type TaskListMetaData = {
  id: string;
  name: string;
  date: string;
  updatedAt: string;
};

export type TaskListData = {
  tasks: Task[];
  taskListMetaData: TaskListMetaData;
};

export type Data = {
  email?: string;
  version?: Version;
  list?: List;
  listId?: string;
  lists?: List[];
  deviceId: string;
  deletedTasksIds?: string[];
  updatedAt: string;
};

export type ImageData = {
  formData: FormData;
  deviceId: string;
};

export type ListsData = {
  lists: List[];
  deviceId: string;
  conflict?: boolean;
  deletedTasksIds?: string[];
};

export type ApiResponse<T> = {
  success: boolean;
  status: number;
  data?: T | null;
  message: string;
};

export type BackupData = {
  version: string;
  timestamp: string;
  createdBy: string;
  fileName: string;
  backupType: BackupType;
  user?: string;
  lists?: List[];
  users?: Array<{
    email: string;
    account: string;
    lists: List[];
    listsCount: number;
    tasksCount: number;
  }>;
  totalUsers?: number;
  totalLists: number;
  totalTasks: number;
};

export type BackupType = "all-users-backup" | "user-lists-backup";
export type BackupFile = { id: string; name: string; modifiedTime?: string };
