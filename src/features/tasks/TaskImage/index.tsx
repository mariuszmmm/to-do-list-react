import { useEffect, useRef, useState } from "react";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { FormButton } from "../../../common/FormButton";
import { FormButtonWrapper } from "../../../common/FormButtonWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useTaskImage } from "../../../hooks";
import { selectTaskById, setImage } from "../tasksSlice";
import { useTranslation } from "react-i18next";
import { MessageContainer } from "../../../common/MessageContainer";
import { Image, ImageInput, ImagePlaceholder, ImagePreview, ProgressBarContainer, ProgressBarFill } from "../../../common/Image";
import { Info } from "../../../common/Info";
import { selectLoggedUserEmail } from "../../AccountPage/accountSlice";
import { useTaskImageRemove } from "./useTaskImageRemove";

export const TaskImage = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const navigate = useNavigate();
  const { id: taskId } = useParams();
  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });
  const { imageUrl, publicId } = task?.image || {}
  const {
    uploadImage,
    removeImage,
    isUploading,
    uploadProgress,
    downloadProgress,
    isDownloading,
    isRemoving,
    imageSrc,
    errorMsg,
    resetError
  } = useTaskImage(imageUrl);
  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [photoSourceButtonsVisible, setPhotoSourceButtonsVisible] = useState(false);


  useEffect(() => {
    window.scrollTo(0, 0);
    const checkMobile = () => {
      const ua = navigator.userAgent;
      if (/android|iphone|ipad|ipod|windows phone/i.test(ua)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    resetError();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!taskId) throw new Error("Missing taskId");
      const result = await uploadImage(file, publicId, `Todo-list/${loggedUserEmail}`);

      if (!result) throw new Error("Upload failed");

      dispatch(
        setImage({
          taskId,
          image: {
            imageUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            createdAt: result.created_at,
            displayName: result.display_name,
            height: result.height,
            width: result.width,
            originalFilename: result.original_filename,
          },
        })
      );
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
    } finally {
      e.target.value = "";
      setPhotoSourceButtonsVisible(false);
    }
  };

  const { setImageRemoving } = useTaskImageRemove({
    resetError,
    taskId,
    publicId,
    removeImage,
  });

  return (
    <>
      <Header title={t('title')} />
      <Section
        title={task ? task.content : t('noTask')}
        body={
          <>
            <ImagePreview >
              {(!task?.image || !imageSrc) && <ImagePlaceholder $imageSrc={imageSrc} />}
              {imageSrc &&
                <Image
                  src={imageSrc}
                  alt="preview"
                  key={imageSrc}
                />
              }

              {(isUploading || isDownloading) && !errorMsg &&
                (
                  <ProgressBarContainer>
                    <ProgressBarFill $width={downloadProgress || uploadProgress} $isDownloading={!!downloadProgress} />
                  </ProgressBarContainer>
                )}
            </ImagePreview>

            {!isMobile && (
              <ImageInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={isUploading}
                style={{ display: "none" }}
              />
            )}
            {isMobile && (
              <>
                <ImageInput
                  ref={fileInputGalleryRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  disabled={isUploading}
                  style={{ display: "none" }}
                />
                <ImageInput
                  ref={fileInputCameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFileChange}
                  disabled={isUploading}
                  style={{ display: "none" }}
                />
              </>
            )}

            <FormButtonWrapper $taskImage>
              <MessageContainer>
                {isUploading && !errorMsg && <Info>{t('messages.uploading')}</Info>}
                {isDownloading && !errorMsg && <Info>{t('messages.loading')}</Info>}
                {isRemoving && !errorMsg && <Info>{t('messages.removing')}</Info>}
                {errorMsg && <Info $warning>{errorMsg}</Info>}
              </MessageContainer>
              {loggedUserEmail &&
                <>
                  {photoSourceButtonsVisible ?
                    <>
                      <FormButton
                        type="button"
                        width="200px"
                        onClick={() => fileInputGalleryRef.current?.click()}
                        disabled={isUploading || isDownloading || isRemoving}
                      >
                        {t('buttons.addFromGallery')}
                      </FormButton>
                      <FormButton
                        type="button"
                        width="200px"
                        onClick={() => fileInputCameraRef.current?.click()}
                        disabled={isUploading || isDownloading || isRemoving}
                      >
                        {t('buttons.takePhoto')}
                      </FormButton>
                    </>
                    :
                    <FormButton
                      type="button"
                      width="200px"
                      onClick={() => {
                        if (!isMobile) {
                          fileInputRef.current?.click();
                        } else {
                          setPhotoSourceButtonsVisible(true);
                        }
                      }}
                      disabled={isUploading || isDownloading || isRemoving}
                    >
                      {!imageUrl ? t('buttons.add') : t('buttons.change')}
                    </FormButton>

                  }

                  {imageUrl && !photoSourceButtonsVisible &&
                    <FormButton
                      type="button"
                      width="200px"
                      onClick={() => setImageRemoving(true)}
                      disabled={isUploading || isDownloading || isRemoving}

                    >
                      {t('buttons.remove')}
                    </FormButton>
                  }

                  {photoSourceButtonsVisible ?
                    <FormButton
                      type="button"
                      width="200px"
                      $cancel
                      onClick={() => setPhotoSourceButtonsVisible(false)}
                    >
                      {t('buttons.cancel')}
                    </FormButton>
                    :
                    <FormButton type="button" width="200px" onClick={() => navigate(-1)} $cancel
                    >
                      {t("buttons.back")}
                    </FormButton>
                  }
                </>
              }
            </FormButtonWrapper>
          </>
        }
      />
    </>
  );
}