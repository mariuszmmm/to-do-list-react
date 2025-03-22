import { Task } from "../types";

const settingsKey = "settings" as const;
const listNameKey = "listName" as const;
const tasksKey = "tasks" as const;

interface Settings {
  showSearch: boolean;
  hideDone: boolean;
}

export const clearLocalStorage = () => localStorage.clear();

export const saveSettingsInLocalStorage = (settings: Settings) =>
  localStorage.setItem(settingsKey, JSON.stringify(settings));

export const getSettingsFromLocalStorage = (): Settings | null => {
  const data = localStorage.getItem(settingsKey);
  return data ? JSON.parse(data) : null;
};

export const saveListNameInLocalStorage = (listName: string) =>
  localStorage.setItem(listNameKey, JSON.stringify(listName));

export const getListNameFromLocalStorage = (): string => {
  const data = localStorage.getItem(listNameKey);
  return data ? JSON.parse(data) : "";
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(tasksKey);
  return data ? JSON.parse(data) : [];
};
