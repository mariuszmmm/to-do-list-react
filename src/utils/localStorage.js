const localStorageTasksKey = "tasks";
const localStorageListsKey = "lists";
const localStorageSettingsKey = "settings";
const localStorageListNameKey = "listName";

export const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem(localStorageTasksKey)) || [];
export const getListsFromLocalStorage = () => JSON.parse(localStorage.getItem(localStorageListsKey)) || [];
export const getSettingsFromLocalStorage = () => JSON.parse(localStorage.getItem(localStorageSettingsKey)) || null;
export const getListNameFromLocalStorage = () => JSON.parse(localStorage.getItem(localStorageListNameKey)) || "";

export const saveTasksInLocalStorage = (tasks) => localStorage.setItem(localStorageTasksKey, JSON.stringify(tasks));
export const saveListsInLocalStorage = (lists) => localStorage.setItem(localStorageListsKey, JSON.stringify(lists));
export const saveSettingsInLocalStorage = (settings) => localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
export const saveListNameInLocalStorage = (listName) => localStorage.setItem(localStorageListNameKey, JSON.stringify(listName));
