export type Task = {
  id: string;
  content: string;
  done: boolean;
  date: string;
  updatedAt: string;
  editedAt?: string;
  completedAt?: string | null;
  status?: "new" | "edited" | "updated" | "deleted" | "synced";
  deletedAt?: string | null;
};

export type EditedTask = { id: string; content: string } | null;

export type ChangeSource = "local" | "remote" | null;
