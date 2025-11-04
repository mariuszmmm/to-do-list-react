import { nanoid } from "@reduxjs/toolkit";
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
  if (!data || data === "undefined") return null;
  return JSON.parse(data);
};

export const saveListMetadataInLocalStorage = (
  taskListMetaData: TaskListMetaData
) => localStorage.setItem(listMetadataKey, JSON.stringify(taskListMetaData));

export const getListMetadataFromLocalStorage = (): TaskListMetaData => {
  const data = localStorage.getItem(listMetadataKey);
  if (!data || data === "undefined")
    return {
      id: nanoid(8),
      date: new Date().toISOString(),
      name: "",
    };

  const parsed = JSON.parse(data);
  const id =
    typeof parsed.id === "string" && parsed.id.trim() !== ""
      ? parsed.id
      : nanoid(8);
  const date =
    typeof parsed.date === "string" && parsed.date.trim() !== ""
      ? parsed.date
      : new Date().toISOString();

  return {
    id,
    date,
    name: parsed.name || "",
  };
};

export const saveTasksInLocalStorage = (tasks: Task[]) =>
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

export const getTasksFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem(tasksKey);
  if (!data || data === "undefined") return [];
  return JSON.parse(data);
};

export const saveArchivedListsInStorage = (lists: List[]) => {
  localStorage.setItem(archivedListsKey, JSON.stringify(lists));
};

export const getArchivedListFromLocalStorage = (): List[] => {
  const data = localStorage.getItem(archivedListsKey);
  if (!data || data === "undefined") return [];
  return JSON.parse(data);
};
