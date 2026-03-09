import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCloudinaryImage } from "../../../../api/cloudinary/deleteImage";
import {
  UploadError,
  UploadErrorCode,
} from "../../../../utils/errors/UploadError";
import { useEffect } from "react";
import { TaskImageProps } from "../types";
import { ListsData } from "../../../../types";
import { getOrCreateDeviceId } from "../../../../utils/storage/deviceId";

interface RemoveArgs {
  publicId: string;
  taskImageProps: TaskImageProps;
}

export const useRemoveTaskImage = () => {
  const deviceId = getOrCreateDeviceId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ publicId, taskImageProps }: RemoveArgs) => {
      if (!taskImageProps.userEmail)
        throw new UploadError(UploadErrorCode.NOT_AUTHENTICATED);
      if (!taskImageProps.taskId) {
        throw new UploadError(UploadErrorCode.GENERAL_ERROR);
      }

      let result;
      try {
        result = await deleteCloudinaryImage({
          publicId,
          taskImageProps,
          deviceId,
        });
      } catch (err: any) {
        throw new UploadError(UploadErrorCode.DELETE_FAILED);
      }

      if (!result.success) {
        throw new UploadError(UploadErrorCode.DELETE_FAILED);
      }

      return {
        listId: taskImageProps.listId,
        taskId: taskImageProps.taskId,
        updatedAt: new Date().toISOString(),
      };
    },

    onSuccess: ({ listId, taskId, updatedAt }) => {
      queryClient.setQueryData(
        ["listsData"],
        (oldData: ListsData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            lists: oldData.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    updatedAt,
                    taskList: list.taskList.map((task) =>
                      task.id === taskId
                        ? { ...task, image: null, updatedAt }
                        : task,
                    ),
                  }
                : list,
            ),
          };
        },
      );
    },
  });

  useEffect(() => {
    if (mutation.error) {
      const timer = setTimeout(() => {
        mutation.reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [mutation.error, mutation]);

  return {
    removeImage: mutation.mutateAsync,
    isRemoving: mutation.isPending,
    removeError: mutation.error,
  };
};
