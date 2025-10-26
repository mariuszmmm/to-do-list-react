import { Task } from "../types";

const settingsKey = "settings" as const;
const listNameKey = "listName" as const;
const activeTasksKey = "active_tasks" as const;
const archivedTasksKey = "archived_tasks" as const;

interface Settings {
  showSearch: boolean;
  hideDone: boolean;
}

interface TasksToArchive {
  id: string;
  title: string;
  listName: string;
  tasks: Task[];
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
  localStorage.setItem(activeTasksKey, JSON.stringify(tasks));

export const archiveTasksInLocalStorage = (tasksToArchive: TasksToArchive) => {
  const data = localStorage.getItem(archivedTasksKey);
  const archivedTasks: TasksToArchive[] = data ? JSON.parse(data) : [];
  archivedTasks.push(tasksToArchive);
  localStorage.setItem(archivedTasksKey, JSON.stringify(archivedTasks));
};

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(activeTasksKey);
  return data ? JSON.parse(data) : [];
};
