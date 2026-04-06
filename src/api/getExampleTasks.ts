import { ExampleTasks } from "../types";

export const getExampleTasks = async (lang: string) => {
  const response = await fetch(`/exampleTasks/${lang}.json`);
  if (!response.ok) {
    new Error(response.statusText);
  }
  const { name, tasks } = (await response.json()) as ExampleTasks;

  return { name, tasks };
};
