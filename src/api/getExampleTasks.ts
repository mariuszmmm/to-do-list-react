import { nanoid } from "@reduxjs/toolkit";
import { ExampleTasks } from "../types";

export const getExampleTasks = async (lang: string) => {
  const response = await fetch(`/exampleTasks/${lang}.json`);
  if (!response.ok) {
    new Error(response.statusText);
  }
  const date = new Date().toISOString();
  const exampleTasks = (await response.json()) as ExampleTasks;
  const taskListMetaData = {
    id: nanoid(8),
    name: exampleTasks.name,
    date,
  };
  const tasks = exampleTasks.tasks.map((exampleTask) => ({
    ...exampleTask,
    date,
  }));

  return { tasks, taskListMetaData };
};
