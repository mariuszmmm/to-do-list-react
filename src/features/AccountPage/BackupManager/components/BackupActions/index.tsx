import React from "react";
import { ButtonsContainer } from "../../../../../common/ButtonsContainer";
import { Button } from "../../../../../common/Button";
import { handleDownloadUserLists } from "../../handlers/handleDownloadUserLists";
import { handleDownloadAllUsers } from "../../handlers/handleDownloadAllUsers";
import { handleRestoreUserLists } from "../../handlers/handleRestoreUserLists";
import { handleRestoreAllUsers } from "../../handlers/handleRestoreAllUsers";
import { handleUploadAllUsersToGoogleDrive } from "../../handlers/handleUploadAllUsersToGoogleDrive";
import { handleFetchGoogleDriveBackupList } from "../../handlers/handleFetchGoogleDriveBackupList";
import { handleAuthorizeGoogle } from "../../handlers/handleAuthorizeGoogle";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../../hooks";
import { selectIsAdmin } from "../../../accountSlice";

interface BackupActionsProps {
  status: { isLoading: boolean };
  showGoogleAuth: boolean;
  googleAccessToken: string | null;
  setStatus: (status: any) => void;
  setShowGoogleAuth: (show: boolean) => void;
  setBackupFiles: (files: any[]) => void;
  setShowBackupList: (show: boolean) => void;
}

export const BackupActions: React.FC<BackupActionsProps> = ({
  status,
  showGoogleAuth,
  googleAccessToken,
  setStatus,
  setShowGoogleAuth,
  setBackupFiles,
  setShowBackupList,
}) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.backup",
  });
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <ButtonsContainer $extra>
      <Button
        onClick={() => handleDownloadUserLists(t, setStatus)}
        disabled={status.isLoading}
        title={t("downloadUserLists.tooltip")}
        data-icon='📥'
      >
        {t("downloadUserLists.button")}
      </Button>

      {isAdmin && (
        <Button
          onClick={() => handleDownloadAllUsers(t, setStatus)}
          disabled={status.isLoading}
          title={t("downloadAllUsers.tooltip")}
          data-icon='📥'
        >
          {t("downloadAllUsers.button")}
        </Button>
      )}

      <Button
        onClick={() => handleRestoreUserLists(t, setStatus)}
        disabled={status.isLoading}
        title={t("restoreUserLists.tooltip")}
        data-icon='📂'
      >
        {t("restoreUserLists.button")}
      </Button>

      {isAdmin && (
        <Button
          onClick={() => handleRestoreAllUsers(t, setStatus)}
          disabled={status.isLoading}
          title={t("restoreAllUsers.tooltip")}
          data-icon='📂'
        >
          {t("restoreAllUsers.button")}
        </Button>
      )}

      {isAdmin && (
        <Button
          onClick={() => handleUploadAllUsersToGoogleDrive(googleAccessToken, t, setStatus, setShowGoogleAuth)}
          disabled={status.isLoading || showGoogleAuth}
          title={t("uploadAllUsersToGoogleDrive.tooltip")}
          data-icon='☁️'
        >
          {t("uploadAllUsersToGoogleDrive.button")}
        </Button>
      )}

      {isAdmin && (
        <Button
          onClick={() =>
            handleFetchGoogleDriveBackupList(
              googleAccessToken,
              t,
              setStatus,
              setShowGoogleAuth,
              setBackupFiles,
              setShowBackupList,
            )
          }
          disabled={status.isLoading || showGoogleAuth}
          title={t("restoreBackupFromGoogleDrive.tooltip")}
          data-icon='☁️'
        >
          {t("restoreBackupFromGoogleDrive.button")}
        </Button>
      )}

      {isAdmin && showGoogleAuth && (
        <Button
          onClick={() => handleAuthorizeGoogle(t, setStatus)}
          disabled={status.isLoading}
          title={t("authorizeGoogle.tooltip")}
          data-icon='🚀'
        >
          {t("authorizeGoogle.button")}
        </Button>
      )}
    </ButtonsContainer>
  );
};
