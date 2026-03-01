import { List, Settings, Task, TaskListMetaData } from "../../types";
import {
  getListMetadataFromSessionStorage,
  getTasksFromSessionStorage,
  saveListMetadataInSessionStorage,
  saveTasksInSessionStorage,
} from "./sessionStorage";

const settingsKey = "settings" as const;
export const listMetadataKey = "taskListMetaData" as const;
export const tasksKey = "tasks" as const;
export const archivedListsKey = "archivedLists" as const;
const autoRefreshKey = "autoRefreshEnabled" as const;

export interface FullTasksData {
  tasks: Task[] | null;
  meta: TaskListMetaData | null;
  archived: List[] | null;
}

export const getTasksData = (): FullTasksData => ({
  tasks: getTasksFromLocalStorage() || getTasksFromSessionStorage() || null,
  meta:
    getListMetadataFromLocalStorage() ||
    getListMetadataFromSessionStorage() ||
    null,
  archived: getArchivedListsFromLocalStorage() || null,
});

export const setTasksData = (data: FullTasksData | null) => {
  if (!data) {
    removeTasksData();
    return;
  }

  // Na podstawie logiki saga, zsynchronizowane listy trafiają do sessionStorage, a lokalne do localStorage
  if (data.meta?.synced) {
    saveTasksInSessionStorage(data.tasks);
    saveListMetadataInSessionStorage(data.meta);
    saveTasksInLocalStorage(null);
    saveListMetadataInLocalStorage(null);
  } else {
    saveTasksInLocalStorage(data.tasks);
    saveListMetadataInLocalStorage(data.meta);
    saveTasksInSessionStorage(null);
    saveListMetadataInSessionStorage(null);
  }

  saveArchivedListsInLocalStorage(data.archived || []);
};

export const removeTasksData = () => {
  localStorage.removeItem(tasksKey);
  localStorage.removeItem(listMetadataKey);
  localStorage.removeItem(archivedListsKey);
  sessionStorage.removeItem(tasksKey);
  sessionStorage.removeItem(listMetadataKey);
};

export const clearLocalStorage = () => localStorage.clear();

export const saveSettingsInLocalStorage = (
  settings: Partial<Settings> | Settings,
) => {
  const existing = localStorage.getItem(settingsKey);

  if (existing) {
    try {
      const parsed = JSON.parse(existing) as Settings;
      const merged = { ...parsed, ...settings } as Settings;
      localStorage.setItem(settingsKey, JSON.stringify(merged));
      return;
    } catch {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      return;
    }
  }

  localStorage.setItem(settingsKey, JSON.stringify(settings));
};

export const getSettingsFromLocalStorage = (): Settings | null => {
  const data = localStorage.getItem(settingsKey);
  if (!data) return null;
  const parsed = JSON.parse(data) as Settings;

  return parsed;
};

export const saveListMetadataInLocalStorage = (
  taskListMetaData: TaskListMetaData | null,
) => {
  if (!taskListMetaData) {
    localStorage.removeItem(listMetadataKey);
    return;
  }
  localStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));
};

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

export const saveTasksInLocalStorage = (tasks: Task[] | null) => {
  if (!tasks) {
    localStorage.removeItem(tasksKey);
    return;
  }
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
};

export const getTasksFromLocalStorage = (): Task[] | undefined => {
  const data = localStorage.getItem(tasksKey);
  if (!data) return;
  const parsed = JSON.parse(data) as Task[];
  return parsed;
};

export const saveArchivedListsInLocalStorage = (lists: List[]) => {
  localStorage.setItem(archivedListsKey, JSON.stringify(lists));
};

export const getArchivedListsFromLocalStorage = (): List[] | undefined => {
  const data = localStorage.getItem(archivedListsKey);
  if (!data) return;
  const parsed = JSON.parse(data) as List[];
  return parsed;
};

export const getAutoRefreshSettingFromLocalStorage = (): boolean => {
  const stored = localStorage.getItem(autoRefreshKey);
  return stored === null ? true : stored === "true";
};

export const saveAutoRefreshSettingInLocalStorage = (
  enabled: boolean,
): void => {
  localStorage.setItem(autoRefreshKey, JSON.stringify(enabled));
};
