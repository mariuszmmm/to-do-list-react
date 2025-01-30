import { List, Task } from "../types";

const localStorageTasksKey = "tasks" as const;
const localStorageListNameKey = "listName" as const;
const localStorageListsKey = "lists" as const;
const localStorageSettingsKey = "settings" as const;
const localStorageTokenKey = "auth_token" as const;
const localStorageUserConfirmedKey = "userConfirmed" as const;

export const getTasksFromLocalStorage = (): Task[] => {
  const storedData = localStorage.getItem(localStorageTasksKey);
  return storedData !== null ? (JSON.parse(storedData) as Task[]) : [];
};
export const getListNameFromLocalStorage = (): List["name"] => {
  const storedData = localStorage.getItem(localStorageListNameKey);
  return storedData !== null ? JSON.parse(storedData) : "";
};
export const getListsFromLocalStorage = (): List[] => {
  const storedData = localStorage.getItem(localStorageListsKey);
  return storedData !== null ? (JSON.parse(storedData) as List[]) : [];
};
export const getSettingsFromLocalStorage = (): {
  hideDone: boolean;
  showSearch: boolean;
} | null => {
  const storedData = localStorage.getItem(localStorageSettingsKey);
  return storedData !== null ? JSON.parse(storedData) : null;
};
export const getTokenFromLocalStorage = (): string => {
  const storedData = localStorage.getItem(localStorageTokenKey);
  return storedData !== null ? JSON.parse(storedData) : "";
};
export const getUserConfirmedFromLocalStorage = (): boolean => {
  const storedData = localStorage.getItem(localStorageUserConfirmedKey);
  return storedData !== null ? JSON.parse(storedData) : false;
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(localStorageTasksKey, JSON.stringify(tasks));
export const saveListNameInLocalStorage = (listName: List["name"]) =>
  localStorage.setItem(localStorageListNameKey, JSON.stringify(listName));
export const saveListsInLocalStorage = (lists: List[]) =>
  localStorage.setItem(localStorageListsKey, JSON.stringify(lists));
export const saveSettingsInLocalStorage = (settings: {
  showSearch: boolean;
  hideDone: boolean;
}) => localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
export const saveTokenInLocalStorage = (token: string) =>
  localStorage.setItem(localStorageTokenKey, JSON.stringify(token));

export const saveUserConfirmedInLocalStorage = (confirmed: boolean) =>
  localStorage.setItem(localStorageUserConfirmedKey, JSON.stringify(confirmed));

export const clearTokenFromLocalStorage = () => {
  localStorage.removeItem(localStorageTokenKey);
};

export const clearUserConfirmedFromLocalStorage = () => {
  localStorage.removeItem(localStorageUserConfirmedKey);
};
