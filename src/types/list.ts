import { Task } from "./task";

export type List = {
  id: string;
  date: string;
  name: string;
  taskList: Task[];
}
