import { List } from "../../../src/types";

export const mapListsToResponse = (lists: List[]): List[] =>
  lists.map((list) => ({
    id: list.id,
    name: list.name,
    date: list.date,
    updatedAt: list.updatedAt,
    version: list.version ?? 0,
    taskList: (list.taskList || []).map((task) => ({
      id: task.id,
      content: task.content,
      done: task.done,
      date: task.date,
      editedAt: task.editedAt,
      completedAt: task.completedAt,
      image: task.image || null,
      updatedAt: task.updatedAt,
    })),
  }));
