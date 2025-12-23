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
import { useSelector } from "react-redux";
import { selectLoggedUserEmail } from "../../../accountSlice";

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
  const { t } = useTranslation("translation", { keyPrefix: "accountPage.backup", });
  const loggedUserEmail = useSelector(selectLoggedUserEmail);

  return (
    <ButtonsContainer $extra>
      {loggedUserEmail && (
        <Button
          onClick={() => handleDownloadUserLists(t, setStatus)}
          disabled={status.isLoading}
          title={t("downloadUserLists.tooltip")}
        >
          📥 {t("downloadUserLists.button")}
        </Button>
      )}
      <Button
        onClick={() => handleDownloadAllUsers(t, setStatus)}
        disabled={status.isLoading}
        title={t("downloadAllUsers.tooltip")}
      >
        📥 {t("downloadAllUsers.button")}
      </Button>
      <Button
        onClick={() => handleRestoreUserLists(t, setStatus)}
        disabled={status.isLoading}
        title={t("restoreUserLists.tooltip")}
      >
        📂 {t("restoreUserLists.button")}
      </Button>
      <Button
        onClick={() => handleRestoreAllUsers(t, setStatus)}
        disabled={status.isLoading}
        title={t("restoreAllUsers.tooltip")}
      >
        📂 {t("restoreAllUsers.button")}
      </Button>
      <Button
        onClick={() => handleUploadAllUsersToGoogleDrive(googleAccessToken, t, setStatus, setShowGoogleAuth)}
        disabled={status.isLoading || showGoogleAuth}
        title={t("uploadAllUsersToGoogleDrive.tooltip")}
      >
        ☁️ {t("uploadAllUsersToGoogleDrive.button")}
      </Button>
      <Button
        onClick={() => handleFetchGoogleDriveBackupList(googleAccessToken, t, setStatus, setShowGoogleAuth, setBackupFiles, setShowBackupList)}
        disabled={status.isLoading || showGoogleAuth}
        title={t("restoreBackupFromGoogleDrive.tooltip")}
      >
        ☁️ {t("restoreBackupFromGoogleDrive.button")}
      </Button>
      {showGoogleAuth && (
        <Button
          onClick={() => handleAuthorizeGoogle(t, setStatus)}
          disabled={status.isLoading}
          title={t("authorizeGoogle.tooltip")}
        >
          🚀 {t("authorizeGoogle.button")}
        </Button>
      )}
    </ButtonsContainer>
  );
}
