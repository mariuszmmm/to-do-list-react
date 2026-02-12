import { memo } from "react";
import { FormButton } from "../../../common/FormButton";
import { FormButtonWrapper } from "../../../common/FormButtonWrapper";
import { useTranslation } from "react-i18next";
import { WebcamError } from "../../../hooks/media/useWebcam";
import { MessageSection } from "./MessageSection";

const BUTTON_PROPS = {
  type: "button" as const,
  width: "200px",
};

interface StatusState {
  isUploading: boolean;
  uploadError: any;
  isRemoving: boolean;
  removeError: any;
  isButtonDisabled: boolean;
  phase: string;
}

interface CameraState {
  isAvailable: boolean | null;
  error: WebcamError | null;
}

interface Actions {
  onGalleryClick: () => void;
  onCameraClick: () => void;
  onAddOrChange: () => void;
  onRemove: () => void;
  onCancel: () => void;
  onBack: () => void;
}

interface DataState {
  loggedUserEmail: string | null;
  taskImageUrl?: string;
  photoSourceButtonsVisible: boolean;
}

interface TaskImageActionsProps {
  status: StatusState;
  camera: CameraState;
  actions: Actions;
  data: DataState;
}

const TaskImageActionsComponent = ({ status, camera, actions, data }: TaskImageActionsProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "taskImagePage",
  });

  if (!data.loggedUserEmail) {
    return null;
  }

  return (
    <FormButtonWrapper $taskImage>
      <MessageSection
        isUploading={status.isUploading}
        uploadError={status.uploadError}
        isRemoving={status.isRemoving}
        removeError={status.removeError}
        isCameraAvailable={camera.isAvailable}
        cameraError={camera.error}
      />

      {data.photoSourceButtonsVisible ? (
        <>
          <FormButton {...BUTTON_PROPS} onClick={actions.onGalleryClick} disabled={status.isButtonDisabled}>
            {t("buttons.uploadFromDevice")}
          </FormButton>
          <FormButton
            {...BUTTON_PROPS}
            onClick={actions.onCameraClick}
            disabled={status.isButtonDisabled || camera.isAvailable === false}
            $image
          >
            {t("buttons.takePicture")}
          </FormButton>
        </>
      ) : (
        <FormButton {...BUTTON_PROPS} onClick={actions.onAddOrChange} disabled={status.isButtonDisabled}>
          {data.taskImageUrl ? t("buttons.change") : t("buttons.add")}
        </FormButton>
      )}

      {data.taskImageUrl && !data.photoSourceButtonsVisible && (
        <FormButton {...BUTTON_PROPS} onClick={actions.onRemove} disabled={status.isButtonDisabled} $remove>
          {t("buttons.remove")}
        </FormButton>
      )}

      <FormButton
        {...BUTTON_PROPS}
        onClick={data.photoSourceButtonsVisible ? actions.onCancel : actions.onBack}
        disabled={status.phase === "committing"}
        $cancel
      >
        {data.photoSourceButtonsVisible || status.isUploading ? t("buttons.cancel") : t("buttons.back")}
      </FormButton>
    </FormButtonWrapper>
  );
};

export const TaskImageActions = memo(TaskImageActionsComponent, (prev, next) => {
  return (
    prev.status.isUploading === next.status.isUploading &&
    prev.status.uploadError === next.status.uploadError &&
    prev.status.isRemoving === next.status.isRemoving &&
    prev.status.removeError === next.status.removeError &&
    prev.status.isButtonDisabled === next.status.isButtonDisabled &&
    prev.status.phase === next.status.phase &&
    prev.camera.isAvailable === next.camera.isAvailable &&
    prev.camera.error === next.camera.error &&
    prev.actions.onGalleryClick === next.actions.onGalleryClick &&
    prev.actions.onCameraClick === next.actions.onCameraClick &&
    prev.actions.onAddOrChange === next.actions.onAddOrChange &&
    prev.actions.onRemove === next.actions.onRemove &&
    prev.actions.onCancel === next.actions.onCancel &&
    prev.actions.onBack === next.actions.onBack &&
    prev.data.loggedUserEmail === next.data.loggedUserEmail &&
    prev.data.taskImageUrl === next.data.taskImageUrl &&
    prev.data.photoSourceButtonsVisible === next.data.photoSourceButtonsVisible
  );
});
