import { User } from "gotrue-js";
import { Task } from "../types";

const userKey = "gotrue.user" as const;
const tasksKey = "tasks" as const;
const listNameKey = "listName" as const;
const settingsKey = "settings" as const;

export const getUserTokenFromLocalStorage = (): string | null => {
  const data = localStorage.getItem(userKey);
  const user: User | null = data ? JSON.parse(data) : null;
  return user?.token.access_token || null;
};

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(tasksKey);
  return data ? JSON.parse(data) : [];
};
export const getListNameFromLocalStorage = (): string => {
  const data = localStorage.getItem(listNameKey);
  return data ? JSON.parse(data) : "";
};

export const getSettingsFromLocalStorage = (): {
  hideDone: boolean;
  showSearch: boolean;
} | null => {
  const data = localStorage.getItem(settingsKey);
  return data ? JSON.parse(data) : null;
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

export const saveListNameInLocalStorage = (listName: string) =>
  localStorage.setItem(listNameKey, JSON.stringify(listName));

export const saveSettingsInLocalStorage = (settings: {
  showSearch: boolean;
  hideDone: boolean;
}) => localStorage.setItem(settingsKey, JSON.stringify(settings));
