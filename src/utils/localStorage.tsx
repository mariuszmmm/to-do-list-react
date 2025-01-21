import { List, Task } from "../types";

const localStorageTasksKey = "tasks" as const;
const localStorageListNameKey = "listName" as const;
const localStorageListsKey = "lists" as const;
const localStorageSettingsKey = "settings" as const;

export const getTasksFromLocalStorage = (): Task[] => {
  const storedData = localStorage.getItem(localStorageTasksKey);
  return storedData !== null ? (JSON.parse(storedData) as Task[]) : [];
};
export const getListNameFromLocalStorage = () => {
  const storedData = localStorage.getItem(localStorageListNameKey);
  return storedData !== null ? JSON.parse(storedData) : "";
};
export const getListsFromLocalStorage = (): List[] => {
  const storedData = localStorage.getItem(localStorageListsKey);
  return storedData !== null ? (JSON.parse(storedData) as List[]) : [];
};
export const getSettingsFromLocalStorage = () => {
  const storedData = localStorage.getItem(localStorageSettingsKey);
  return storedData !== null ? JSON.parse(storedData) : null;
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(localStorageTasksKey, JSON.stringify(tasks));
export const saveListNameInLocalStorage = (listName: string) =>
  localStorage.setItem(localStorageListNameKey, JSON.stringify(listName));
export const saveListsInLocalStorage = (lists: List[]) =>
  localStorage.setItem(localStorageListsKey, JSON.stringify(lists));
export const saveSettingsInLocalStorage = (settings: {
  showSearch: boolean;
  hideDone: boolean;
}) => localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
