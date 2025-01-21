export interface Task {
  id: string;
  content: string;
  done: boolean;
  date: string;
  doneDate?: string | null;
  editedDate?: string | null;
}

export interface List {
  name: string;
  taskList: Task[];
  id: string;
  selected?: boolean;
}
