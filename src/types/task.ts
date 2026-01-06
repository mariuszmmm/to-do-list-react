export type Task = {
  id: string;
  content: string;
  done: boolean;
  date: string;
  editedAt?: string;
  updatedAt: string;
  completedAt?: string | null;
  status?: "new" | "edited" | "updated" | "deleted" | "synced";
};

export type EditedTask = { id: string; content: string } | null;

export type ChangeSource = "local" | "remote" | null;
