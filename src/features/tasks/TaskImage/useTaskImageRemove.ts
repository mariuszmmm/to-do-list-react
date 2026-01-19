import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setImage } from "../tasksSlice";
import {
  closeModal,
  openModal,
  selectModalConfirmed,
} from "../../../Modal/modalSlice";

interface UseTaskImageRemoveProps {
  resetError: () => void;
  taskId?: string;
  publicId?: string;
  removeImage: (publicId: string) => Promise<unknown>;
}

export const useTaskImageRemove = ({
  resetError,
  taskId,
  publicId,
  removeImage,
}: UseTaskImageRemoveProps): {
  setImageRemoving: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  const [imageRemoving, setImageRemoving] = useState(false);
  const confirmed = useAppSelector(selectModalConfirmed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleImageRemoving = async () => {
      if (!imageRemoving) return;
      resetError();
      if (confirmed) {
        setImageRemoving(false);
        dispatch(closeModal());
        try {
          if (!taskId) throw new Error("Missing taskId");
          if (!publicId) throw new Error("No publicId provided");

          const result = await removeImage(publicId);
          if (!result) throw new Error("Image removal failed");

          dispatch(setImage({ taskId, image: null }));
        } catch (error: unknown) {
          console.error("Error removing image from Cloudinary:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageRemoving, confirmed]);

  return { setImageRemoving };
};
