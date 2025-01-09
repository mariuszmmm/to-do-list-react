const localStorageTasksKey = "tasks";
const localStorageSettingsKey = "settings";

export const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem(localStorageTasksKey)) || [];

export const saveTasksInLocalStorage = (tasks) => localStorage.setItem(localStorageTasksKey, JSON.stringify(tasks));

export const getSettingsFromLocalStorage = () => JSON.parse(localStorage.getItem(localStorageSettingsKey)) || null;

export const saveSettingsInLocalStorage = (settings) => localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
