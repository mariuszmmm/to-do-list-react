import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";
import { TaskImageProps } from "../../features/tasks/TaskImage/types";

interface MoveCloudinaryImageArgs {
  publicId: string;
  taskImageProps: TaskImageProps;
  oldPublicId?: string;
  deviceId: string;
}

export const moveCloudinaryImage = async ({
  publicId,
  taskImageProps,
  oldPublicId,
  deviceId,
}: MoveCloudinaryImageArgs) => {
  const token = await getUserToken();

  if (!token) {
    throw new Error("User token is null");
  }

  const params = new URLSearchParams();
  params.append("publicId", publicId);
  params.append("folder", `${taskImageProps.userEmail}/${taskImageProps.listName}`);

  const optionalParams = [
    taskImageProps.userEmail && ["userEmail", taskImageProps.userEmail],
    taskImageProps.listId && ["listId", taskImageProps.listId],
    taskImageProps.listName && ["listName", taskImageProps.listName],
    taskImageProps.taskId && ["taskId", taskImageProps.taskId],
    oldPublicId && ["oldPublicId", oldPublicId],
    deviceId && ["deviceId", deviceId],
  ].filter(Boolean) as [string, string][];

  optionalParams.forEach(([key, value]) => params.append(key, value));

  const res = await axios.put(`/image-cloudinary?${params.toString()}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
