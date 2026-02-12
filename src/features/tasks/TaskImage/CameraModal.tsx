import { RefObject, memo } from "react";
import { useTranslation } from "react-i18next";
import { FormButton } from "../../../common/FormButton";
import { CameraModalOverlay, CameraContainer, CameraVideo, CameraModalButtons } from "../../../common/CameraModal";
import { Info } from "../../../common/Info";
import { WebcamError } from "../../../hooks/media/useWebcam";

interface CameraModalProps {
  isOpen: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraError: WebcamError | null;
  isActive: boolean;
  isCameraLoading: boolean;
  isUploading: boolean;
  onTakePhoto: () => void;
  onClose: () => void;
}

const CameraModalComponent = ({
  isOpen,
  videoRef,
  cameraError,
  isActive,
  isCameraLoading,
  isUploading,
  onTakePhoto,
  onClose,
}: CameraModalProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });

  return (
    <CameraModalOverlay $isOpen={isOpen}>
      <CameraContainer>
        {cameraError ? (
          <Info $warning>
            {cameraError.type === "permission-denied"
              ? t("messages.cameraPermissionDenied")
              : cameraError.type === "camera-not-found"
                ? t("messages.cameraNotFound")
                : t("messages.cameraError")}
          </Info>
        ) : (
          <CameraVideo ref={videoRef} autoPlay muted playsInline />
        )}
      </CameraContainer>
      <CameraModalButtons>
        <FormButton
          type='button'
          width='150px'
          onClick={onTakePhoto}
          disabled={!isActive || cameraError !== null || isCameraLoading || isUploading}
          $image
        >
          {t("buttons.capture")}
        </FormButton>
        <FormButton type='button' width='150px' $cancel onClick={onClose} disabled={isUploading}>
          {t("buttons.close")}
        </FormButton>
      </CameraModalButtons>
    </CameraModalOverlay>
  );
};

export const CameraModal = memo(CameraModalComponent);
