import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useCloudinaryUpload } from "../../../hooks/media/cloudinary/useCloudinaryUpload";
import { moveCloudinaryImage } from "../../../api/cloudinary/moveImage";
import { deleteCloudinaryImage } from "../../../api/cloudinary/deleteImage";
import { setImage } from "../tasksSlice";
import { selectLoggedUserEmail } from "../../AccountPage/accountSlice";
import { UploadError, UploadErrorCode } from "../../../utils/errors/UploadError";
import { useEffect, useRef, useState } from "react";
import { isCanceledError } from "../../../utils/errors/isCanceledError";

type UploadPhase = "idle" | "uploading" | "committing";

interface UploadArgs {
  file: File;
  taskId: string;
  previousPublicId?: string;
}

export const useUploadTaskImage = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectLoggedUserEmail);
  const cloudinary = useCloudinaryUpload();

  const cancelRequestedRef = useRef(false);
  const [phase, setPhase] = useState<UploadPhase>("idle");

  const mutation = useMutation({
    mutationFn: async ({ file, taskId, previousPublicId }: UploadArgs) => {
      if (!email) throw new UploadError(UploadErrorCode.NOT_AUTHENTICATED);

      cancelRequestedRef.current = false;
      setPhase("uploading");

      let temp;

      try {
        temp = await cloudinary.upload(file, taskId);
      } catch (err) {
        if (isCanceledError(err)) {
          throw new UploadError(UploadErrorCode.UPLOAD_CANCELED);
        }
        throw new UploadError(UploadErrorCode.GENERAL_ERROR, "Failed to upload image");
      }

      if (!temp?.public_id) {
        throw new UploadError(UploadErrorCode.UPLOAD_INVALID_RESPONSE);
      }

      setPhase("committing");

      const moved = await moveCloudinaryImage(temp.public_id, email);
      if (!moved?.result?.public_id) {
        throw new UploadError(UploadErrorCode.MOVE_FAILED);
      }

      if (cancelRequestedRef.current) {
        try {
          await deleteCloudinaryImage(moved.result.public_id);
        } catch (err) {
          console.warn("Failed to cleanup canceled upload:", moved.result.public_id, err);
        }
        throw new UploadError(UploadErrorCode.CANCELED_AFTER_UPLOAD);
      }

      if (previousPublicId) {
        try {
          await deleteCloudinaryImage(previousPublicId);
        } catch (err) {
          console.warn("Failed to cleanup old image (will be handled by scheduled cleanup):", previousPublicId, err);
        }
      }

      return { taskId, image: moved.result };
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
    if (phase === "uploading") {
      cloudinary.cancel();
    } else if (phase === "committing") {
      cancelRequestedRef.current = true;
    }
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
    error: mutation.error,
    reset: mutation.reset,
  };
};
