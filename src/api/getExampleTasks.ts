import { nanoid } from "@reduxjs/toolkit";
import { ExampleTasks } from "../types";

export const getExampleTasks = async (lang: string) => {
  const response = await fetch(`/exampleTasks/${lang}.json`);
  if (!response.ok) {
    new Error(response.statusText);
  }

  const exampleTasks = (await response.json()) as ExampleTasks;
  const id = nanoid(8);
  const date = new Date().toISOString();
  const name = exampleTasks.name;
  const tasks = exampleTasks.tasks.map((exampleTask) => ({
    ...exampleTask,
    date,
  }));

  return { id, date, name, tasks };
};
