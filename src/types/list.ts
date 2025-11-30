import { Version } from "./account";
import { Task } from "./task";

export type List = {
  id: string;
  name: string;
  date: string;
  version: Version;
  taskList: Task[];
  deviceId?: string;
  updatedAt?: string;
};
