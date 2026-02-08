import { useEffect, useRef, useState } from "react";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { FormButton } from "../../../common/FormButton";
import { FormButtonWrapper } from "../../../common/FormButtonWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useTaskImage } from "../../../hooks";
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
import { useTaskImageRemove } from "./useTaskImageRemove";

export const TaskImage = () => {
  const navigate = useNavigate();
  const { id: taskId } = useParams();
  const task = useAppSelector((state) => (taskId ? selectTaskById(state, taskId) : null));
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });
  const { imageUrl: taskImageUrl, publicId: taskImagePublicId } = task?.image || {};
  const {
    imageUrl,
    publicId,
    isUploadingFile,
    imageUpload,
    removeImage,
    isImageUploading,
    uploadProgress,
    isRemoving,
    errorMsg,
    resetError,
    cancelUpload,
  } = useTaskImage(taskImageUrl, taskImagePublicId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);
  // const isCanceledRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [photoSourceButtonsVisible, setPhotoSourceButtonsVisible] = useState(false);
  const localPreviewUrlRef = useRef<string>("");
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(hasTouch && hasCoarsePointer);
    };
    checkMobile();
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // isCanceledRef.current = false;

    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
    }
    const previewUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = previewUrl;
    await imageUpload(file, publicId, taskId);
    setPhotoSourceButtonsVisible(false);
    localPreviewUrlRef.current = "";
    e.target.value = "";
  };

  const { setImageRemoving } = useTaskImageRemove({
    resetError,
    taskId,
    publicId,
    removeImage,
    localPreviewUrlRef,
    imageUrl,
  });

  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
  }, [localPreviewUrlRef]);

  // console.log("IMAGE: RENDER", {
  // localPreviewUrlRef: localPreviewUrlRef.current,
  // imageUrl,
  // taskImageUrl,
  // taskImagePublicId,
  // publicId,
  // taskId,
  // loggedUserEmail,
  // isImageUploading,
  // isRemoving,
  // });

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
                {!localPreviewUrlRef.current && !imageUrl && !taskImageUrl ? (
                  <ImagePlaceholder />
                ) : (
                  <Image src={localPreviewUrlRef.current || imageUrl || taskImageUrl} alt='image preview' />
                )}

                {isImageUploading && !errorMsg && (
                  <ProgressBarContainer>
                    <ProgressBarFill $width={uploadProgress} />
                  </ProgressBarContainer>
                )}
              </ImagePreview>

              {!isMobile && (
                <ImageInput
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={onFileChange}
                  disabled={isImageUploading}
                  style={{ display: "none" }}
                />
              )}
              {isMobile && (
                <>
                  <ImageInput
                    ref={fileInputGalleryRef}
                    type='file'
                    accept='image/*'
                    onChange={onFileChange}
                    disabled={isImageUploading}
                    style={{ display: "none" }}
                  />
                  <ImageInput
                    ref={fileInputCameraRef}
                    type='file'
                    accept='image/*'
                    capture='environment'
                    onChange={onFileChange}
                    disabled={isImageUploading}
                    style={{ display: "none" }}
                  />
                </>
              )}

              <FormButtonWrapper $taskImage>
                <MessageContainer>
                  {isImageUploading && !errorMsg && <Info>{t("messages.uploading")}</Info>}
                  {isRemoving && !isImageUploading && !errorMsg && <Info>{t("messages.removing")}</Info>}
                  {errorMsg && <Info $warning>{errorMsg}</Info>}
                </MessageContainer>
                {loggedUserEmail && (
                  <>
                    {photoSourceButtonsVisible ? (
                      <>
                        <FormButton
                          type='button'
                          width='200px'
                          onClick={() => fileInputGalleryRef.current?.click()}
                          disabled={isImageUploading || isRemoving}
                        >
                          {t("buttons.addFromGallery")}
                        </FormButton>
                        <FormButton
                          type='button'
                          width='200px'
                          onClick={() => fileInputCameraRef.current?.click()}
                          disabled={isImageUploading || isRemoving}
                        >
                          {t("buttons.takePhoto")}
                        </FormButton>
                      </>
                    ) : (
                      <FormButton
                        type='button'
                        width='200px'
                        onClick={() => {
                          if (!isMobile) {
                            fileInputRef.current?.click();
                          } else {
                            setPhotoSourceButtonsVisible(true);
                          }
                        }}
                        disabled={isImageUploading || isRemoving}
                      >
                        {!imageUrl && !taskImageUrl ? t("buttons.add") : t("buttons.change")}
                      </FormButton>
                    )}

                    {(imageUrl || taskImageUrl) && !photoSourceButtonsVisible && (
                      <FormButton
                        type='button'
                        width='200px'
                        onClick={() => {
                          setImageRemoving(true);
                        }}
                        disabled={isImageUploading || isRemoving}
                      >
                        {t("buttons.remove")}
                      </FormButton>
                    )}

                    {photoSourceButtonsVisible ? (
                      <FormButton
                        type='button'
                        width='200px'
                        // $cancel
                        // onClick={() => setPhotoSourceButtonsVisible(false)}

                        onClick={() => {
                          if (isImageUploading && !isRemoving) {
                            if (localPreviewUrlRef.current) {
                              URL.revokeObjectURL(localPreviewUrlRef.current);
                            }
                            // isCanceledRef.current = true;
                            localPreviewUrlRef.current = taskImageUrl || "";
                            cancelUpload();
                            return;
                          }
                          setPhotoSourceButtonsVisible(false);
                        }}
                        disabled={isImageUploading && !isUploadingFile}
                      >
                        {t("buttons.cancel")}
                      </FormButton>
                    ) : (
                      <FormButton
                        type='button'
                        width='200px'
                        onClick={() => {
                          if (isImageUploading && !isRemoving) {
                            if (localPreviewUrlRef.current) {
                              URL.revokeObjectURL(localPreviewUrlRef.current);
                            }
                            // isCanceledRef.current = true;
                            localPreviewUrlRef.current = taskImageUrl || "";
                            cancelUpload();
                            return;
                          }
                          navigate(-1);
                        }}
                        // $cancel
                        disabled={isImageUploading && !isUploadingFile}
                      >
                        {isImageUploading ? t("buttons.cancel") : t("buttons.back")}
                      </FormButton>
                    )}
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
