import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux";
import { closeModal, openModal, selectModalConfirmed } from "../../../Modal/modalSlice";

interface UseRemoveTaskImageWithConfirmationProps {
  taskId?: string;
  taskImagePublicId?: string;
  removeImage: (params: { publicId: string; taskId: string }) => Promise<void>;
  clearPreview: () => void;
}

export const useRemoveTaskImageWithConfirmation = ({
  taskId,
  taskImagePublicId,
  removeImage,
  clearPreview,
}: UseRemoveTaskImageWithConfirmationProps) => {
  const dispatch = useAppDispatch();
  const confirmed = useAppSelector(selectModalConfirmed);
  const [imageRemoving, setImageRemoving] = useState(false);

  useEffect(() => {
    const handleImageRemoving = async () => {
      if (!imageRemoving) return;

      if (confirmed) {
        setImageRemoving(false);
        dispatch(closeModal());
        try {
          if (taskImagePublicId && taskId) {
            await removeImage({ publicId: taskImagePublicId, taskId });
            clearPreview();
          }
        } catch (error) {
          console.error("Error removing image:", error);
        }
      } else {
        if (confirmed === false) {
          setImageRemoving(false);
          dispatch(closeModal());
          return;
        }
        dispatch(
          openModal({
            title: { key: "modal.imageRemove.title" },
            message: {
              key: "modal.imageRemove.message.confirm",
            },
            type: "confirm",
            confirmButton: { key: "modal.buttons.deleteButton" },
          }),
        );
      }
    };

    handleImageRemoving();
  }, [imageRemoving, confirmed, dispatch, taskImagePublicId, taskId, removeImage, clearPreview]);

  const handleRemoveImage = () => {
    setImageRemoving(true);
  };

  return { handleRemoveImage };
};
