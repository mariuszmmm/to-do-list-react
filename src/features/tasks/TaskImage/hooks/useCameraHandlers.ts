import { TaskImageProps } from "../types";

interface UseCameraHandlersParams {
  taskImageProps: TaskImageProps;
  capturePhoto: () => Promise<Blob | null>;
  setPreview: (file: File) => void;
  uploadTaskImage: (params: { file: File; taskImageProps: TaskImageProps; previousPublicId?: string }) => Promise<any>;
  taskImagePublicId?: string;
  stopCamera: () => void;
  clearPreview: () => void;
  setIsCameraModalOpen: (isOpen: boolean) => void;
  setPhotoSourceButtonsVisible: (visible: boolean) => void;
}

export const useCameraHandlers = ({
  taskImageProps,
  capturePhoto,
  setPreview,
  uploadTaskImage,
  taskImagePublicId,
  stopCamera,
  clearPreview,
  setIsCameraModalOpen,
  setPhotoSourceButtonsVisible,
}: UseCameraHandlersParams) => {
  const handleCameraClick = () => {
    setIsCameraModalOpen(true);
    setPhotoSourceButtonsVisible(false);
  };

  const handleTakePhoto = async () => {
    if (!taskImageProps.taskId) return;

    const blob = await capturePhoto();
    if (!blob) return;

    setIsCameraModalOpen(false);
    stopCamera();

    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
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
    }
  };

  const handleCloseCameraModal = () => {
    setIsCameraModalOpen(false);
    stopCamera();
  };

  return {
    handleCameraClick,
    handleTakePhoto,
    handleCloseCameraModal,
  };
};
