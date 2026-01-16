import { useEffect, useRef } from "react";
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
    imageSrc,
    errorMsg,
    resetError
  } = useTaskImage(imageUrl);
  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    }
  };

  const onRemoveImage = async () => {
    resetError();

    try {
      if (!taskId) throw new Error("Missing taskId");
      if (!publicId) throw new Error("No publicId provided");

      const result = await removeImage(publicId);
      if (!result) throw new Error("Image removal failed");
      dispatch(setImage({ taskId, image: null }))
    } catch (error: unknown) {
      console.error("Error removing image from Cloudinary:", error);
    }
  }

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

            <ImageInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={isUploading}
            />

            <FormButtonWrapper $taskImage>
              <MessageContainer>
                {isUploading && !errorMsg && <Info>{t('messages.uploading')}</Info>}
                {isDownloading && !errorMsg && <Info>{t('messages.loading')}</Info>}
                {errorMsg && <Info $warning>{errorMsg}</Info>}
              </MessageContainer>

              {loggedUserEmail && <FormButton
                type="button"
                width="200px"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                $singleInput
              >
                {!imageUrl ? t('buttons.add') : t('buttons.change')}
              </FormButton>}

              {(loggedUserEmail && imageUrl) && <FormButton
                type="button"
                width="200px"
                onClick={onRemoveImage}
                disabled={isUploading}
                $singleInput
              >
                {t('buttons.remove')}
              </FormButton>
              }

              <FormButton type="button" width={"200px"} onClick={() => navigate(-1)} $singleInput>
                {t("buttons.back")}
              </FormButton>
            </FormButtonWrapper>
          </>
        }
      />
    </>
  );
}