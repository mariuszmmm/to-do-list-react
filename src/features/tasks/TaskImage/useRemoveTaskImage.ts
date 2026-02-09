import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../hooks";
import { deleteCloudinaryImage } from "../../../api/cloudinary/deleteImage";
import { setImage } from "../tasksSlice";
import { UploadError, UploadErrorCode } from "../../../utils/errors/UploadError";

interface RemoveArgs {
  taskId: string;
  publicId: string;
}

export const useRemoveTaskImage = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ publicId }: RemoveArgs) => {
      try {
        await deleteCloudinaryImage(publicId);
      } catch (err) {
        throw new UploadError(UploadErrorCode.DELETE_FAILED, "Failed to delete image from Cloudinary");
      }
    },

    onSuccess: (_, { taskId }) => {
      dispatch(setImage({ taskId, image: null }));
    },
  });
};
