import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../hooks";
import { deleteCloudinaryImage } from "../../../api/cloudinary/deleteImage";
import { setImage } from "../tasksSlice";

interface RemoveArgs {
  taskId: string;
  publicId: string;
}

export const useRemoveTaskImage = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ publicId }: RemoveArgs) => {
      await deleteCloudinaryImage(publicId);
    },

    onSuccess: (_, { taskId }) => {
      dispatch(setImage({ taskId, image: null }));
    },
  });
};
