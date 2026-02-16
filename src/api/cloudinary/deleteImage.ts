import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";
import { TaskImageProps } from "../../features/tasks/TaskImage/types";

interface DeleteCloudinaryImageArgs {
  publicId: string;
  taskImageProps: TaskImageProps;
  deviceId: string;
}

export const deleteCloudinaryImage = async ({ publicId, taskImageProps, deviceId }: DeleteCloudinaryImageArgs) => {
  const token = await getUserToken();

  if (!token) {
    throw new Error("User token is null");
  }

  const params = new URLSearchParams();
  params.append("publicId", publicId);

  const optionalParams = [
    taskImageProps.userEmail && ["userEmail", taskImageProps.userEmail],
    taskImageProps.listId && ["listId", taskImageProps.listId],
    taskImageProps.listName && ["listName", taskImageProps.listName],
    taskImageProps.taskId && ["taskId", taskImageProps.taskId],
    deviceId && ["deviceId", deviceId],
  ].filter(Boolean) as [string, string][];

  optionalParams.forEach(([key, value]) => params.append(key, value));

  const res = await axios.delete(`/image?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
