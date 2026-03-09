import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCloudinaryUpload } from "../../../../hooks/media/cloudinary/useCloudinaryUpload";
import { moveCloudinaryImage } from "../../../../api/cloudinary/moveImage";
import {
  UploadError,
  UploadErrorCode,
} from "../../../../utils/errors/UploadError";
import { useEffect, useState } from "react";
import { isCanceledError } from "../../../../utils/errors/isCanceledError";
import { TaskImageProps } from "../types";
import { ListsData } from "../../../../types";
import { getOrCreateDeviceId } from "../../../../utils/storage/deviceId";

type UploadPhase = "idle" | "uploading" | "committing";

interface UploadArgs {
  file: File;
  taskImageProps: TaskImageProps;
  previousPublicId?: string;
}

export const useUploadTaskImage = () => {
  const cloudinary = useCloudinaryUpload();
  const queryClient = useQueryClient();
  const deviceId = getOrCreateDeviceId();
  const [phase, setPhase] = useState<UploadPhase>("idle");

  const mutation = useMutation({
    mutationFn: async ({
      file,
      taskImageProps,
      previousPublicId,
    }: UploadArgs) => {
      if (!taskImageProps.userEmail)
        throw new UploadError(UploadErrorCode.NOT_AUTHENTICATED);
      if (!taskImageProps.taskId) {
        throw new UploadError(UploadErrorCode.GENERAL_ERROR);
      }

      setPhase("uploading");

      let temp;

      try {
        temp = await cloudinary.upload(file);
      } catch (err) {
        if (isCanceledError(err)) {
          throw new UploadError(UploadErrorCode.UPLOAD_CANCELED);
        }

        if (err instanceof UploadError) {
          throw err;
        }
        throw new UploadError(UploadErrorCode.GENERAL_ERROR);
      }

      if (!temp?.public_id) {
        throw new UploadError(UploadErrorCode.UPLOAD_INVALID_RESPONSE);
      }

      setPhase("committing");

      let moved;
      try {
        moved = await moveCloudinaryImage({
          publicId: temp.public_id,
          taskImageProps,
          oldPublicId: previousPublicId,
          deviceId,
        });
      } catch (err: any) {
        throw new UploadError(UploadErrorCode.MOVE_FAILED);
      }

      if (!moved.success) {
        throw new UploadError(UploadErrorCode.MOVE_FAILED);
      }

      return {
        listId: taskImageProps.listId,
        taskId: taskImageProps.taskId,
        image: moved.result,
        updatedAt: new Date().toISOString(), // Simulating the server timestamp
      };
    },

    onSuccess: ({ listId, taskId, image, updatedAt }) => {
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
                    updatedAt, // Important for React Query as well
                    taskList: list.taskList.map((task) =>
                      task.id === taskId ? { ...task, image, updatedAt } : task,
                    ),
                  }
                : list,
            ),
          };
        },
      );

      setPhase("idle");
      setTimeout(() => cloudinary.resetProgress(), 300);
    },

    onError: () => {
      setPhase("idle");
      setTimeout(() => cloudinary.resetProgress(), 300);
    },
  });

  const cancelUpload = () => {
    if (phase === "uploading") cloudinary.cancel();
  };

  useEffect(() => {
    if (mutation.error) {
      const timer = setTimeout(() => {
        mutation.reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [mutation.error, mutation]);

  return {
    uploadTaskImage: mutation.mutateAsync,
    cancelUpload,
    progress: cloudinary.progress,
    phase,
    isUploading: mutation.isPending,
    uploadError: mutation.error,
  };
};
