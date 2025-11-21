import { List, Settings, Task, TaskListMetaData } from "../types";

const settingsKey = "settings" as const;
const listMetadataKey = "taskListMetaData" as const;
const tasksKey = "tasks" as const;
const archivedListsKey = "archivedLists" as const;
const timeKey = "time" as const;

export const clearLocalStorage = () => localStorage.clear();

export const saveSettingsInLocalStorage = (settings: Settings) =>
  localStorage.setItem(settingsKey, JSON.stringify(settings));

export const getSettingsFromLocalStorage = (): Settings | null => {
  const data = localStorage.getItem(settingsKey);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveListMetadataInLocalStorage = (
  taskListMetaData: TaskListMetaData
) => localStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));

export const getListMetadataFromLocalStorage = ():
  | TaskListMetaData
  | undefined => {
  const data = localStorage.getItem(listMetadataKey);
  if (!data) return;

  const parsed: TaskListMetaData = JSON.parse(data);
  const id = parsed.id;
  const date = parsed.date;
  const name = parsed.name;

  if (!id || !date || !name) {
    return;
  } else
    return {
      id,
      date,
      name,
    };
};

export const saveTimeInLocalStorage = (time: {
  lastChangeTime?: string;
  synchronizedTime?: string;
}) => localStorage.setItem(timeKey, JSON.stringify(time));

export const getTimeFromLocalStorage = ():
  | {
      lastChangeTime?: string;
      synchronizedTime?: string;
    }
  | undefined => {
  const data = localStorage.getItem(timeKey);
  if (!data) return;
  const parsed = JSON.parse(data);
  if (!parsed.synchonizedTime) {
    return;
  } else {
    return parsed.synchonizedTime;
  }
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

export const getTasksFromLocalStorage = (): Task[] | undefined => {
  const data = localStorage.getItem(tasksKey);
  if (!data) return;
  return JSON.parse(data);
};

export const saveArchivedListsInStorage = (lists: List[]) => {
  localStorage.setItem(archivedListsKey, JSON.stringify(lists));
};

export const getArchivedListFromLocalStorage = (): List[] | undefined => {
  const data = localStorage.getItem(archivedListsKey);
  if (!data) return;
  return JSON.parse(data);
};
