import UserData from "../../models/UserData";
import { Image } from "../../../src/types";
import { logError } from "../lib/response";

interface UpdateTaskImageParams {
  userEmail?: string;
  listId?: string;
  taskId?: string;
  image: Image | null;
  logPrefix?: string;
}

export default async function updateTaskImageInUserData({
  userEmail,
  listId,
  taskId,
  image,
  logPrefix = "[updateTaskImageInUserData]",
}: UpdateTaskImageParams): Promise<boolean> {
  if (!userEmail || !listId || !taskId) {
    console.warn("[updateTaskImageInUserData] Brak wymaganych parametrów:", { userEmail, listId, taskId });
    return false;
  }

  let user;
  try {
    user = await UserData.findOne({ email: userEmail, account: "active" }).exec();
    if (!user) {
      console.warn(`[updateTaskImageInUserData] Nie znaleziono użytkownika: ${userEmail}`);
      return false;
    }
  } catch (err) {
    logError(`${logPrefix} Błąd podczas pobierania użytkownika:`, err, logPrefix);
    return false;
  }

  const list = user.lists.find((l: any) => l.id === listId);
  if (!list) {
    console.warn(`[updateTaskImageInUserData] Nie znaleziono listy: ${listId} dla użytkownika: ${userEmail}`);
    return false;
  }

  const task = list.taskList.find((t: any) => t.id === taskId);
  if (!task) {
    console.warn(`[updateTaskImageInUserData] Nie znaleziono zadania: ${taskId} na liście: ${listId}`);
    return false;
  }

  task.image = image;
  try {
    await user.save();
    return true;
  } catch (err) {
    logError(`${logPrefix} Błąd podczas zapisu użytkownika:`, err, logPrefix);
    return false;
  }
}
