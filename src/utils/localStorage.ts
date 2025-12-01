import { List, Settings, Task, TaskListMetaData } from "../types";

const settingsKey = "settings" as const;
const listMetadataKey = "taskListMetaData" as const;
const tasksKey = "tasks" as const;
const archivedListsKey = "archivedLists" as const;

export const clearLocalStorage = () => localStorage.clear();

export const saveSettingsInLocalStorage = (settings: Settings) =>
  localStorage.setItem(settingsKey, JSON.stringify(settings));

export const getSettingsFromLocalStorage = (): Settings | null => {
  const data = localStorage.getItem(settingsKey);
  if (!data) return null;
  const parsed = JSON.parse(data) as Settings;

  return parsed;
};

export const saveListMetadataInLocalStorage = (
  taskListMetaData: TaskListMetaData
) => localStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));

export const getListMetadataFromLocalStorage = ():
  | TaskListMetaData
  | undefined => {
  const data = localStorage.getItem(listMetadataKey);
  if (!data) return;

  const parsed = JSON.parse(data) as TaskListMetaData;
  if (!parsed.id || !parsed.date || !parsed.name || !parsed.updatedAt) {
    return;
  }

  return parsed;
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

export const getTasksFromLocalStorage = (): Task[] | undefined => {
  const data = localStorage.getItem(tasksKey);
  if (!data) return;
  const parsed = JSON.parse(data) as Task[];

  return parsed;
};

export const saveArchivedListsInStorage = (lists: List[]) => {
  localStorage.setItem(archivedListsKey, JSON.stringify(lists));
};

export const getArchivedListFromLocalStorage = (): List[] | undefined => {
  const data = localStorage.getItem(archivedListsKey);
  if (!data) return;
  const parsed = JSON.parse(data) as List[];

  return parsed;
};
