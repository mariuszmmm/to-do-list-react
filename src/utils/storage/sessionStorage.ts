import { Task, TaskListMetaData } from "../../types";

const confimationTokenKey = "confirmation_token" as const;
const recoveryTokenKey = "recovery_token" as const;
const listMetadataKey = "taskListMetaData" as const;
const tasksKey = "tasks" as const;

export const clearSessionStorage = () => sessionStorage.clear();

export const saveConfimationTokenInSessionStorage = (token: string) =>
  sessionStorage.setItem(confimationTokenKey, JSON.stringify(token));

export const getConfimationTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(confimationTokenKey);
  return data ? JSON.parse(data) : null;
};

export const saveRecoveryTokenFromSessionStorage = (token: string) =>
  sessionStorage.setItem(recoveryTokenKey, JSON.stringify(token));

export const getRecoveryTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(recoveryTokenKey);
  return data ? JSON.parse(data) : null;
};

export const saveListMetadataInSessionStorage = (taskListMetaData: TaskListMetaData | null) => {
  if (!taskListMetaData) {
    sessionStorage.removeItem(listMetadataKey);
    return;
  }
  sessionStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));
};

export const getListMetadataFromSessionStorage = (): TaskListMetaData | undefined => {
  const data = sessionStorage.getItem(listMetadataKey);
  if (!data) return;

  const parsed = JSON.parse(data) as TaskListMetaData;
  if (!parsed.id || !parsed.date || !parsed.name || !parsed.updatedAt) {
    return;
  }

  return parsed;
};

export const saveTasksInSessionStorage = (tasks: Task[] | null) => {
  if (!tasks) {
    sessionStorage.removeItem(tasksKey);
    return;
  }
  sessionStorage.setItem(tasksKey, JSON.stringify(tasks));
};

export const getTasksFromSessionStorage = (): Task[] => {
  const data = sessionStorage.getItem(tasksKey);
  if (!data) return [];
  const parsed = JSON.parse(data) as Task[];
  return parsed;
};
