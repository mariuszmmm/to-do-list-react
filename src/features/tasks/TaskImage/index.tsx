import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { FormButton } from "../../../common/FormButton";
import { FormButtonWrapper } from "../../../common/FormButtonWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { selectTaskById } from "../tasksSlice";
import { useTranslation } from "react-i18next";
import { MessageContainer } from "../../../common/MessageContainer";
import {
  Image,
  ImageInput,
  ImagePlaceholder,
  ImagePreview,
  ProgressBarContainer,
  ProgressBarFill,
} from "../../../common/Image";
import { Info } from "../../../common/Info";
import { selectLoggedUserEmail } from "../../AccountPage/accountSlice";
import { useImagePreview } from "../../../hooks/media/cloudinary/useImagePreview";
import { useIsMobile } from "../../../hooks";
import { useUploadTaskImage } from "./useUploadTaskImage";
import { useRemoveTaskImage } from "./useRemoveTaskImage";
import { useConfirmRemoveAction } from "./useConfirmRemoveAction";
import { getUploadErrorMessage } from "../../../utils/errors/getUploadErrorMessage";

export const TaskImage = () => {
  const navigate = useNavigate();
  const { id: taskId } = useParams();
  const task = useAppSelector((state) => (taskId ? selectTaskById(state, taskId) : null));
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });
  const { imageUrl: taskImageUrl, publicId: taskImagePublicId } = task?.image || {};

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);
  const [photoSourceButtonsVisible, setPhotoSourceButtonsVisible] = useState(false);
  const isMobile = useIsMobile();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  const { previewUrl, setPreview, clearPreview } = useImagePreview();
  const { uploadTaskImage, cancelUpload, progress, phase, isUploading, error } = useUploadTaskImage();
  const { mutateAsync: removeImage, isPending: isRemoving } = useRemoveTaskImage();

  const handleConfirmRemove = useCallback(async () => {
    if (taskImagePublicId && taskId) {
      await removeImage({ publicId: taskImagePublicId, taskId });
      clearPreview();
    }
  }, [taskImagePublicId, taskId, removeImage, clearPreview]);

  const { trigger: handleRemoveImage, isPending: isConfirmingRemove } = useConfirmRemoveAction({
    onConfirm: handleConfirmRemove,
    title: { key: "modal.imageRemove.title" },
    message: { key: "modal.imageRemove.message.confirm" },
    confirmButtonLabel: { key: "modal.buttons.deleteButton" },
  });

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !taskId) return;
      setPreview(file);

      try {
        await uploadTaskImage({
          file,
          taskId,
          previousPublicId: taskImagePublicId,
        });
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        clearPreview();
        setPhotoSourceButtonsVisible(false);
        e.target.value = "";
      }
    },
    [taskId, uploadTaskImage, taskImagePublicId, setPreview, clearPreview],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const commonButtonProps = useMemo(
    () => ({
      type: "button" as const,
      width: "200px",
    }),
    [],
  );

  const fileInputProps = useMemo(
    () => ({
      type: "file" as const,
      accept: "image/*",
      onChange: onFileChange,
      disabled: isUploading,
      style: { display: "none" },
    }),
    [onFileChange, isUploading],
  );

  const isButtonDisabled = useMemo(
    () => isUploading || isRemoving || isConfirmingRemove,
    [isUploading, isRemoving, isConfirmingRemove],
  );

  const imageSrc = useMemo(() => previewUrl || taskImageUrl, [previewUrl, taskImageUrl]);

  const handleCancelUpload = useCallback(() => {
    cancelUpload();
    clearPreview();
  }, [cancelUpload, clearPreview]);

  const handleAddOrChange = useCallback(() => {
    isMobile ? setPhotoSourceButtonsVisible(true) : fileInputRef.current?.click();
  }, [isMobile]);

  const handleCancelButton = useCallback(() => {
    if (isUploading && !isRemoving) {
      handleCancelUpload();
    } else {
      setPhotoSourceButtonsVisible(false);
    }
  }, [isUploading, isRemoving, handleCancelUpload]);

  const handleBackButton = useCallback(() => {
    if (isUploading) {
      handleCancelUpload();
    } else {
      navigate(-1);
    }
  }, [isUploading, navigate, handleCancelUpload]);

  const handleGalleryClick = useCallback(() => {
    fileInputGalleryRef.current?.click();
  }, []);

  const handleCameraClick = useCallback(() => {
    fileInputCameraRef.current?.click();
  }, []);

  return (
    <>
      <Header title={t("title")} />
      <Section
        taskDetails
        title={task ? task.content : t("noTask")}
        body={
          task && (
            <>
              <ImagePreview>
                {imageSrc ? <Image src={imageSrc} alt='image preview' /> : <ImagePlaceholder />}

                {isUploading && (
                  <ProgressBarContainer>
                    <ProgressBarFill $width={progress} />
                  </ProgressBarContainer>
                )}
              </ImagePreview>

              {isMobile ? (
                <>
                  <ImageInput ref={fileInputGalleryRef} {...fileInputProps} />
                  <ImageInput ref={fileInputCameraRef} {...fileInputProps} capture='environment' />
                </>
              ) : (
                <ImageInput ref={fileInputRef} {...fileInputProps} />
              )}

              <FormButtonWrapper $taskImage>
                <MessageContainer>
                  {isUploading && !error && <Info>{t("messages.uploading")}</Info>}
                  {isRemoving && !isUploading && !error && <Info>{t("messages.removing")}</Info>}
                  {error && <Info $warning>{getUploadErrorMessage(error)}</Info>}
                </MessageContainer>

                {loggedUserEmail && (
                  <>
                    {photoSourceButtonsVisible ? (
                      <>
                        <FormButton {...commonButtonProps} onClick={handleGalleryClick} disabled={isButtonDisabled}>
                          {t("buttons.addFromGallery")}
                        </FormButton>
                        <FormButton {...commonButtonProps} onClick={handleCameraClick} disabled={isButtonDisabled}>
                          {t("buttons.takePhoto")}
                        </FormButton>
                      </>
                    ) : (
                      <FormButton {...commonButtonProps} onClick={handleAddOrChange} disabled={isButtonDisabled}>
                        {taskImageUrl ? t("buttons.change") : t("buttons.add")}
                      </FormButton>
                    )}

                    {taskImageUrl && !photoSourceButtonsVisible && (
                      <FormButton
                        {...commonButtonProps}
                        onClick={handleRemoveImage}
                        disabled={isButtonDisabled}
                        $remove
                      >
                        {t("buttons.remove")}
                      </FormButton>
                    )}

                    <FormButton
                      {...commonButtonProps}
                      onClick={photoSourceButtonsVisible ? handleCancelButton : handleBackButton}
                      disabled={phase === "committing"}
                      $cancel
                    >
                      {photoSourceButtonsVisible || isUploading ? t("buttons.cancel") : t("buttons.back")}
                    </FormButton>
                  </>
                )}
              </FormButtonWrapper>
            </>
          )
        }
      />
    </>
  );
};
