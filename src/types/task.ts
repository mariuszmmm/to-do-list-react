export type Task = {
  id: string;
  content: string;
  done: boolean;
  date: string;
  doneDate?: string | null;
  editedDate?: string | null;
};

export type ChangeSource = "local" | "remote" | null;
