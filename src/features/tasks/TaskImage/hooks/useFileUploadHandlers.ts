import { RefObject } from "react";
import { TaskImageProps } from "../types";

interface UseFileUploadHandlersParams {
  taskImageProps: TaskImageProps;
  setPreview: (file: File) => void;
  uploadTaskImage: (params: { file: File; taskImageProps: TaskImageProps; previousPublicId?: string }) => Promise<any>;
  taskImagePublicId?: string;
  clearPreview: () => void;
  setPhotoSourceButtonsVisible: (visible: boolean) => void;
  cancelUpload: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const useFileUploadHandlers = ({
  taskImageProps,
  setPreview,
  uploadTaskImage,
  taskImagePublicId,
  clearPreview,
  setPhotoSourceButtonsVisible,
  cancelUpload,
  fileInputRef,
}: UseFileUploadHandlersParams) => {
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !taskImageProps.taskId) return;
    setPreview(file);

    try {
      await uploadTaskImage({
        file,
        taskImageProps,
        previousPublicId: taskImagePublicId,
      });
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      clearPreview();
      setPhotoSourceButtonsVisible(false);
      e.target.value = "";
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    cancelUpload();
    clearPreview();
  };

  return {
    onFileChange,
    handleGalleryClick,
    handleCancelUpload,
  };
};
