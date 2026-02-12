import { WebcamError } from "../../../../hooks/media/useWebcam";

interface UseTaskImageActionsPropsParams {
  isUploading: boolean;
  uploadError: any;
  isRemoving: boolean;
  isButtonDisabled: boolean;
  removeError: any;
  phase: string;
  isCameraAvailable: boolean | null;
  cameraError: WebcamError | null;
  handleGalleryClick: () => void;
  handleCameraClick: () => void;
  handleAddOrChange: () => void;
  handleRemoveImage: () => void;
  handleCancelButton: () => void;
  handleBackButton: () => void;
  loggedUserEmail: string | null;
  taskImageUrl?: string;
  photoSourceButtonsVisible: boolean;
}

export const useTaskImageActionsProps = ({
  isUploading,
  uploadError,
  isRemoving,
  isButtonDisabled,
  removeError,
  phase,
  isCameraAvailable,
  cameraError,
  handleGalleryClick,
  handleCameraClick,
  handleAddOrChange,
  handleRemoveImage,
  handleCancelButton,
  handleBackButton,
  loggedUserEmail,
  taskImageUrl,
  photoSourceButtonsVisible,
}: UseTaskImageActionsPropsParams) => {
  const status = {
    isUploading,
    uploadError,
    isRemoving,
    isButtonDisabled,
    removeError,
    phase,
  };

  const camera = {
    isAvailable: isCameraAvailable,
    error: cameraError,
  };

  const actions = {
    onGalleryClick: handleGalleryClick,
    onCameraClick: handleCameraClick,
    onAddOrChange: handleAddOrChange,
    onRemove: handleRemoveImage,
    onCancel: handleCancelButton,
    onBack: handleBackButton,
  };

  const data = {
    loggedUserEmail,
    taskImageUrl,
    photoSourceButtonsVisible,
  };

  return { status, camera, actions, data };
};
