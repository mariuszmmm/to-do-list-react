import { Task } from "./task";

export interface List {
  id: string;
  name: string;
  taskList: Task[];
}
