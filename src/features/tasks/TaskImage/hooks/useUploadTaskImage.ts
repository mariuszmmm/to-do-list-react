import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../../hooks";
import { useCloudinaryUpload } from "../../../../hooks/media/cloudinary/useCloudinaryUpload";
import { moveCloudinaryImage } from "../../../../api/cloudinary/moveImage";
import { setImage } from "../../tasksSlice";
import { UploadError, UploadErrorCode } from "../../../../utils/errors/UploadError";
import { useEffect, useState } from "react";
import { isCanceledError } from "../../../../utils/errors/isCanceledError";
import { TaskImageProps } from "../types";

type UploadPhase = "idle" | "uploading" | "committing";

interface UploadArgs {
  file: File;
  taskImageProps: TaskImageProps;
  previousPublicId?: string;
}

export const useUploadTaskImage = () => {
  const dispatch = useAppDispatch();
  const cloudinary = useCloudinaryUpload();

  const [phase, setPhase] = useState<UploadPhase>("idle");

  const mutation = useMutation({
    mutationFn: async ({ file, taskImageProps, previousPublicId }: UploadArgs) => {
      if (!taskImageProps.userEmail) throw new UploadError(UploadErrorCode.NOT_AUTHENTICATED);
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
        console.error("XXX Upload error:", err);
        throw new UploadError(UploadErrorCode.GENERAL_ERROR);
      }

      if (!temp?.public_id) {
        throw new UploadError(UploadErrorCode.UPLOAD_INVALID_RESPONSE);
      }

      setPhase("committing");

      const moved = await moveCloudinaryImage(temp.public_id, taskImageProps, previousPublicId);

      if (!moved?.result?.public_id) {
        throw new UploadError(UploadErrorCode.MOVE_FAILED);
      }

      const image = { ...moved.result, original_filename: file.name };

      return { taskId: taskImageProps.taskId, image };
    },

    onSuccess: ({ taskId, image }) => {
      dispatch(
        setImage({
          taskId,
          image: {
            imageUrl: image.secure_url,
            publicId: image.public_id,
            width: image.width,
            height: image.height,
            format: image.format,
            createdAt: image.created_at,
            displayName: image.display_name,
            originalFilename: image.original_filename,
          },
        }),
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
