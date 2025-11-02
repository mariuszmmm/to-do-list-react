import { D } from "@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o";
import { Version } from "./account";
import { List } from "./list";
import { Task } from "./task";

export type ExampleTasks = {
  name: string;
  tasks: Task[];
};

export type TasksData = {
  id: string;
  date: string;
  name: string;
  tasks: Task[];
};

export type Data = {
  email?: string;
  version?: Version;
  list?: List;
  listId?: string;
  lists?: List[];
};

export type ListsData = {
  email: string;
  lists: List[];
  version: Version;
};
