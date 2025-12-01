import { Version } from "./account";
import { Task } from "./task";

export type List = {
  id: string;
  name: string;
  date: string;
  updatedAt: string;
  version: Version;
  taskList: Task[];
};
