import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../../hooks";
import { deleteCloudinaryImage } from "../../../../api/cloudinary/deleteImage";
import { setImage } from "../../tasksSlice";
import { UploadError, UploadErrorCode } from "../../../../utils/errors/UploadError";
import { useEffect } from "react";

interface RemoveArgs {
  publicId: string;
  taskId: string;
}

export const useRemoveTaskImage = () => {
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: async ({ publicId }: RemoveArgs) => {
      try {
        const result = await deleteCloudinaryImage(publicId);

        if (result?.result === "not found") {
          console.warn(`[useRemoveTaskImage] Image not found in Cloudinary: ${publicId}`);
        }
      } catch (err) {
        throw new UploadError(UploadErrorCode.DELETE_FAILED);
      }
    },

    onSuccess: (_, { taskId }) => {
      if (!taskId) return;
      dispatch(setImage({ taskId, image: null }));
    },

    onError: () => {},
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
