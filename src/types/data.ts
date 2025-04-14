import { Version } from "./account";
import { List } from "./list";
import { Task } from "./task";

export interface ExampleTasks {
  listName: string;
  tasks: Task[];
}

export type Data = {
  email?: string;
  version?: Version;
  list?: List;
  listId?: string;
  lists?: List[];
};
