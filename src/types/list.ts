import { Version } from "./account";
import { Task } from "./task";

export type List = {
  id: string;
  date: string;
  name: string;
  version: Version;
  taskList: Task[];
};
