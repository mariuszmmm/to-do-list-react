import { List, Settings, Task, TaskListMetaData } from "../../types";
import { syncToIndexedDB } from "./storageSync";
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
      const parsed = JSON.parse(existing);
      const merged = { ...parsed, ...settings };
      localStorage.setItem(settingsKey, JSON.stringify(merged));
      syncToIndexedDB(settingsKey, merged);
    } catch {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      syncToIndexedDB(settingsKey, settings);
    }
  } else {
    // Brak wcześniejszych danych – zapisujemy goły obiekt
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    syncToIndexedDB(settingsKey, settings);
  }
};

export const getSettingsFromLocalStorage = (): Settings | null => {
  const data = localStorage.getItem(settingsKey);
  return data ? JSON.parse(data) : null;
};

// Funkcja pomocnicza specjalnie dla metadata z localStorage (dla listy)
export const saveListMetadataInLocalStorage = (
  taskListMetaData: TaskListMetaData | null,
) => {
  if (!taskListMetaData) {
    localStorage.removeItem(listMetadataKey);
    syncToIndexedDB(listMetadataKey, null);
    return;
  }
  localStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));
  syncToIndexedDB(listMetadataKey, taskListMetaData);
};

export const getListMetadataFromLocalStorage = ():
  | TaskListMetaData
  | undefined => {
  const data = localStorage.getItem(listMetadataKey);
  if (!data) return undefined;

  const parsed = JSON.parse(data);
  if (!parsed.id || !parsed.date || !parsed.name || !parsed.updatedAt) {
    return;
  }

  return parsed;
};

// Zapis pobranych danych z Google Drive (Zadania).
// Jeśli remoteDate (w timestamp) będzie nowsza niż aktualna, zastąpi to dane lokalne.
// Potem (w thunku) możemy po prostu wrzucić to z powrotem do Reduxa.
export const saveTasksInLocalStorage = (tasks: Task[] | null) => {
  if (!tasks) {
    localStorage.removeItem(tasksKey);
    syncToIndexedDB(tasksKey, null);
    return;
  }
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
  syncToIndexedDB(tasksKey, tasks);
};

export const getTasksFromLocalStorage = (): Task[] | undefined => {
  const data = localStorage.getItem(tasksKey);
  if (!data) return undefined;

  return JSON.parse(data);
};

export const saveArchivedListsInLocalStorage = (lists: List[]) => {
  localStorage.setItem(archivedListsKey, JSON.stringify(lists));
  syncToIndexedDB(archivedListsKey, lists);
};

export const getArchivedListsFromLocalStorage = (): List[] | undefined => {
  const data = localStorage.getItem(archivedListsKey);
  if (!data) return undefined;
  return JSON.parse(data);
};

export const getAutoRefreshSettingFromLocalStorage = (): boolean => {
  const stored = localStorage.getItem(autoRefreshKey);
  return stored ? JSON.parse(stored) : false;
};

export const saveAutoRefreshSettingInLocalStorage = (
  enabled: boolean,
): void => {
  localStorage.setItem(autoRefreshKey, JSON.stringify(enabled));
  syncToIndexedDB(autoRefreshKey, enabled);
};
