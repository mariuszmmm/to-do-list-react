import { Task, TaskListMetaData } from "../../types";

const confimationTokenKey = "confirmation_token" as const;
const recoveryTokenKey = "recovery_token" as const;
const inviteTokenKey = "invite_token" as const;
const emailChangeTokenKey = "email_change_token" as const;
const listMetadataKey = "taskListMetaData" as const;
const tasksKey = "tasks" as const;

export const clearSessionStorage = () => sessionStorage.clear();

export const saveConfimationTokenInSessionStorage = (token: string) =>
  sessionStorage.setItem(confimationTokenKey, JSON.stringify(token));

export const getConfimationTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(confimationTokenKey);
  return data ? JSON.parse(data) : null;
};

export const removeConfimationTokenFromSessionStorage = () =>
  sessionStorage.removeItem(confimationTokenKey);

export const saveRecoveryTokenInSessionStorage = (token: string) =>
  sessionStorage.setItem(recoveryTokenKey, JSON.stringify(token));

export const getRecoveryTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(recoveryTokenKey);
  return data ? JSON.parse(data) : null;
};

export const removeRecoveryTokenFromSessionStorage = () =>
  sessionStorage.removeItem(recoveryTokenKey);

export const saveInviteTokenInSessionStorage = (token: string) =>
  sessionStorage.setItem(inviteTokenKey, JSON.stringify(token));

export const getInviteTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(inviteTokenKey);
  return data ? JSON.parse(data) : null;
};

export const removeInviteTokenFromSessionStorage = () =>
  sessionStorage.removeItem(inviteTokenKey);

export const saveEmailChangeTokenInSessionStorage = (token: string) =>
  sessionStorage.setItem(emailChangeTokenKey, JSON.stringify(token));

export const getEmailChangeTokenFromSessionStorage = (): string | null => {
  const data = sessionStorage.getItem(emailChangeTokenKey);
  return data ? JSON.parse(data) : null;
};

export const removeEmailChangeTokenFromSessionStorage = () =>
  sessionStorage.removeItem(emailChangeTokenKey);

export const saveListMetadataInSessionStorage = (
  taskListMetaData: TaskListMetaData | null,
) => {
  if (!taskListMetaData) {
    sessionStorage.removeItem(listMetadataKey);
    return;
  }
  sessionStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));
};

export const getListMetadataFromSessionStorage = ():
  | TaskListMetaData
  | undefined => {
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
