import { Image } from "./image";

export type Task = {
  id: string;
  content: string;
  done: boolean;
  date: string;
  editedAt?: string;
  completedAt?: string | null;
  updatedAt: string;
  status?: "new" | "edited" | "updated" | "deleted" | "synced";
  deletedAt?: string | null;
  image?: Image | null;
};

export type EditedTask = { id: string; content: string } | null;

export type ChangeSource = "local" | "remote" | null;
