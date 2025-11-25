import { Version } from "./account";
import { List } from "./list";
import { Task } from "./task";

export type ExampleTasks = {
  name: string;
  tasks: Task[];
};

export type TaskListMetaData = {
  id: string;
  name: string;
  date: string;
  updatedAt?: string;
};

export type TaskListData = {
  tasks: Task[];
  taskListMetaData: TaskListMetaData;
};

export type Data = {
  email?: string;
  version?: Version;
  list?: List;
  listId?: string;
  lists?: List[];
  deviceId?: string;
};

export type ListsData = {
  lists: List[];
  conflict?: boolean;
};
