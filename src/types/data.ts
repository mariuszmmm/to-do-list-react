import { Version } from "./account";
import { List } from "./list";
import { Task } from "./task";

export interface ExampleTasks {
  listName: string;
  tasks: Task[];
}
export interface Data {
  email: string;
  lists: List[];
  version: Version;
}
