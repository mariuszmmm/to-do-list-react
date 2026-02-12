import { memo } from "react";
import { useTranslation } from "react-i18next";
import { MessageContainer } from "../../../common/MessageContainer";
import { Info } from "../../../common/Info";
import { WebcamError } from "../../../hooks/media/useWebcam";
import { getUploadErrorMessage } from "../../../utils/errors/getUploadErrorMessage";

interface MessageSectionProps {
  isUploading: boolean;
  uploadError: any;
  isRemoving: boolean;
  removeError: any;
  isCameraAvailable: boolean | null;
  cameraError: WebcamError | null;
}

const MessageSectionComponent = ({
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

  return (
    <MessageContainer>
      {isUploading && <Info>{t("messages.uploading")}</Info>}
      {isRemoving && <Info>{t("messages.removing")}</Info>}
      {uploadError && <Info $warning>{getUploadErrorMessage(uploadError)}</Info>}
      {removeError && <Info $warning>{getUploadErrorMessage(removeError)}</Info>}
      {isCameraAvailable === false && <Info $warning>{cameraError?.message || t("messages.cameraNotFound")}</Info>}
    </MessageContainer>
  );
};

export const MessageSection = memo(MessageSectionComponent);
