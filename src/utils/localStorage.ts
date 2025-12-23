import { List, Settings, Task, TaskListMetaData } from "../types";

const settingsKey = "settings" as const;
const listMetadataKey = "taskListMetaData" as const;
const tasksKey = "tasks" as const;
const archivedListsKey = "archivedLists" as const;
const autoRefreshKey = "autoRefreshEnabled" as const;

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

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(tasksKey);
  if (!data) return [];
  const parsed = JSON.parse(data) as Task[];
  return parsed;
};

export const saveArchivedListsInLocalStorage = (lists: List[]) => {
  localStorage.setItem(archivedListsKey, JSON.stringify(lists));
};

export const getArchivedListsFromLocalStorage = (): List[] => {
  const data = localStorage.getItem(archivedListsKey);
  if (!data) return [];
  const parsed = JSON.parse(data) as List[];
  return parsed;
};

export const getAutoRefreshSettingFromLocalStorage = (): boolean => {
  const stored = localStorage.getItem(autoRefreshKey);
  return stored === null ? true : stored === "true";
};

export const saveAutoRefreshSettingInLocalStorage = (
  enabled: boolean
): void => {
  localStorage.setItem(autoRefreshKey, JSON.stringify(enabled));
};
