import { Task } from "./task";

export type ListMetadata = {
  id: string;
  date: string;
  name: string;
};

export type List = {
  id: ListMetadata["id"];
  date: ListMetadata["date"];
  name: ListMetadata["name"];
  taskList: Task[];
};
