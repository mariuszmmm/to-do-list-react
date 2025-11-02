import { List, ListMetadata, Settings, Task } from "../types";

const settingsKey = "settings" as const;
const listMetadataKey = "listMetadata" as const;
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

export const saveListMetadataInLocalStorage = (listMetadata: ListMetadata) =>
  localStorage.setItem(listMetadataKey, JSON.stringify(listMetadata));

export const getListMetadataFromLocalStorage = (): ListMetadata => {
  const data = localStorage.getItem(listMetadataKey);
  if (!data || data === "undefined") return { id: "", date: "", name: "" };
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
