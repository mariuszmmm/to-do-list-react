import { useRef, useState } from "react";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageInput,
  ImagePlaceholder,
  ImagePreview,
  ProgressBarContainer,
  ProgressBarFill,
} from "../../../common/Image";
import { selectLoggedUserEmail } from "../../AccountPage/accountSlice";
import { useImagePreview } from "../../../hooks/media/cloudinary/useImagePreview";
import { useWebcam, useScrollToTop, useCameraModal } from "../../../hooks";
import { useUploadTaskImage } from "./hooks/useUploadTaskImage";
import { useRemoveTaskImage } from "./hooks/useRemoveTaskImage";
import { useConfirmRemoveAction } from "./hooks/useConfirmRemoveAction";
import { useCameraHandlers } from "./hooks/useCameraHandlers";
import { useFileUploadHandlers } from "./hooks/useFileUploadHandlers";
import { useTaskImageActionsProps } from "./hooks/useTaskImageActionsProps";
import { CameraModal } from "./CameraModal";
import { TaskImageActions } from "./TaskImageActions";
import { TaskImageProps } from "./types";
import { ListsData } from "../../../types";

type Props = {
  listsData?: ListsData;
  localListId: string;
};

export const TaskImage = ({ listsData, localListId }: Props) => {
  const navigate = useNavigate();
  const { id: taskId } = useParams();
  const email = useAppSelector(selectLoggedUserEmail);

  const remoteList = listsData?.lists.find((list) => list.id === localListId);
  const remoteTask = remoteList?.taskList.find((t) => t.id === taskId);
  const taskImageProps: TaskImageProps = {
    userEmail: email,
    listId: remoteList?.id ?? "",
    listName: remoteList?.name ?? "",
    taskId,
  };
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });
  const { imageUrl: taskImageUrl, publicId: taskImagePublicId } = remoteTask?.image || {};

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoSourceButtonsVisible, setPhotoSourceButtonsVisible] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  const { previewUrl, setPreview, clearPreview } = useImagePreview();
  const { uploadTaskImage, cancelUpload, progress, phase, isUploading, uploadError } = useUploadTaskImage();
  const { removeImage, isRemoving, removeError } = useRemoveTaskImage();
  const {
    videoRef,
    isActive,
    isAvailable: isCameraAvailable,
    error: cameraError,
    isLoading: isCameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useWebcam();

  const handleConfirmRemove = async () => {
    if (taskImagePublicId && taskImageProps.taskId) {
      try {
        await removeImage({ publicId: taskImagePublicId, taskImageProps });
        clearPreview();
      } catch (err) {
        console.error("[TaskImage] Remove image failed", err);
      }
    }
  };

  const { trigger: handleRemoveImage, isPending: isConfirmingRemove } = useConfirmRemoveAction({
    onConfirm: handleConfirmRemove,
    title: { key: "modal.imageRemove.title" },
    message: { key: "modal.imageRemove.message.confirm" },
    confirmButtonLabel: { key: "modal.buttons.deleteButton" },
  });

  const { onFileChange, handleGalleryClick, handleCancelUpload } = useFileUploadHandlers({
    taskImageProps,
    setPreview,
    uploadTaskImage,
    taskImagePublicId,
    clearPreview,
    setPhotoSourceButtonsVisible,
    cancelUpload,
    fileInputRef,
  });

  const { handleCameraClick, handleTakePhoto, handleCloseCameraModal } = useCameraHandlers({
    taskImageProps,
    capturePhoto,
    setPreview,
    uploadTaskImage,
    taskImagePublicId,
    stopCamera,
    clearPreview,
    setIsCameraModalOpen,
    setPhotoSourceButtonsVisible,
  });

  useScrollToTop();

  useCameraModal({
    isModalOpen: isCameraModalOpen,
    isActive,
    startCamera,
    stopCamera,
  });

  const fileInputProps = {
    type: "file" as const,
    accept: "image/*",
    capture: "environment" as const,
    onChange: onFileChange,
    disabled: isUploading,
    style: { display: "none" },
  };

  const isButtonDisabled = isUploading || isRemoving || isConfirmingRemove;
  const imageSrc = previewUrl || taskImageUrl;

  const handleAddOrChange = () => {
    setPhotoSourceButtonsVisible(true);
  };

  const handleCancelButton = () => {
    if (isUploading && !isRemoving) {
      handleCancelUpload();
    } else {
      setPhotoSourceButtonsVisible(false);
    }
  };

  const handleBackButton = () => {
    if (isUploading) {
      handleCancelUpload();
    } else {
      navigate(-1);
    }
  };

  const taskImageActionsProps = useTaskImageActionsProps({
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
  });

  return (
    <>
      <Header title={t("title")} />
      <Section
        taskDetails
        title={remoteTask ? remoteTask.content : t("noTask")}
        body={
          remoteTask && (
            <>
              <ImagePreview>
                {imageSrc ? <Image src={imageSrc} alt='image preview' /> : <ImagePlaceholder />}

                {isUploading && (
                  <ProgressBarContainer>
                    <ProgressBarFill $width={progress} />
                  </ProgressBarContainer>
                )}
              </ImagePreview>

              <ImageInput ref={fileInputRef} {...fileInputProps} />

              {typeof window !== "undefined" &&
                !(
                  "ontouchstart" in window ||
                  (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
                ) && (
                  <CameraModal
                    isOpen={isCameraModalOpen}
                    videoRef={videoRef}
                    cameraError={cameraError}
                    isActive={isActive}
                    isCameraLoading={isCameraLoading}
                    isUploading={isUploading}
                    onTakePhoto={handleTakePhoto}
                    onClose={handleCloseCameraModal}
                  />
                )}

              <TaskImageActions
                status={taskImageActionsProps.status}
                camera={taskImageActionsProps.camera}
                actions={taskImageActionsProps.actions}
                data={taskImageActionsProps.data}
              />
            </>
          )
        }
      />
    </>
  );
};
