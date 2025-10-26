import { List, Settings, Task, } from "../types";

const settingsKey = "settings" as const;
const listNameKey = "listName" as const;
const tasksKey = "tasks" as const;
const listsKey = "archivedLists" as const;

export const clearLocalStorage = () => localStorage.clear();

export const saveSettingsInLocalStorage = (settings: Settings) =>
  localStorage.setItem(settingsKey, JSON.stringify(settings));

export const getSettingsFromLocalStorage = (): Settings | null => {
  const data = localStorage.getItem(settingsKey);
  if (!data || data === "undefined") return null;
  return JSON.parse(data);
};

export const saveListNameInLocalStorage = (listName: string) =>
  localStorage.setItem(listNameKey, JSON.stringify(listName));

export const getListNameFromLocalStorage = (): string => {
  const data = localStorage.getItem(listNameKey);
  if (!data || data === "undefined") return "";
  return JSON.parse(data);
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(tasksKey);
  if (!data || data === "undefined") return [];
  return JSON.parse(data);
};

export const saveArchivedListsInStorage = (lists: List[]) => {
  localStorage.setItem(listsKey, JSON.stringify(lists));
};

export const getArchivedListFromLocalStorage = (): List[] => {
  const data = localStorage.getItem(listsKey);
  if (!data || data === "undefined") return [];
  return JSON.parse(data);
};
