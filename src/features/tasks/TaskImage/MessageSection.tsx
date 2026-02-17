import { useTranslation } from "react-i18next";
import { MessageContainer } from "../../../common/MessageContainer";
import { Info } from "../../../common/Info";
import { WebcamError } from "../../../hooks/media/useWebcam";
import { getUploadErrorMessage } from "../../../utils/errors/getUploadErrorMessage";
import { useTranslatedText } from "../../../hooks/ui/useTranslatedText";

interface MessageSectionProps {
  isUploading: boolean;
  uploadError: any;
  isRemoving: boolean;
  removeError: any;
  isCameraAvailable: boolean | null;
  cameraError: WebcamError | null;
}

export const MessageSection = ({
  isUploading,
  uploadError,
  isRemoving,
  removeError,
  isCameraAvailable,
  cameraError,
}: MessageSectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });

  const translatedCameraError = useTranslatedText(cameraError?.message);

  return (
    <MessageContainer>
      {isUploading && <Info>{t("messages.uploading")}</Info>}
      {isRemoving && <Info>{t("messages.removing")}</Info>}
      {uploadError && <Info $warning>{getUploadErrorMessage(uploadError)}</Info>}
      {removeError && <Info $warning>{getUploadErrorMessage(removeError)}</Info>}
      {isCameraAvailable === false && (
        <Info $warning>{cameraError?.message ? translatedCameraError : t("messages.cameraNotFound")}</Info>
      )}
    </MessageContainer>
  );
};
