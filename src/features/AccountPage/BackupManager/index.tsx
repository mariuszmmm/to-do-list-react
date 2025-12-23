import { useState } from "react";
import { BackupList } from "./components/BackupList";
import { BackupActions } from "./components/BackupActions";
import { BackupStatusMessage } from "./components/BackupStatusMessage";
import { useTranslation } from "react-i18next";
import { useGoogleOAuth } from "./hooks/useGoogleOAuth";
import { useDeleteBackupConfirmation } from "./hooks/useDeleteBackupConfirmation";
import { BackupFile } from "../../../types";

export type StatusState = {
  isLoading: boolean;
  message: string;
  messageType: "success" | "error" | "info";
}

export const BackupManager = () => {
  const { t } = useTranslation("translation", { keyPrefix: "accountPage.backup", });
  const [status, setStatus] = useState<StatusState>({ isLoading: false, message: "", messageType: "info", });
  const { googleAccessToken, showGoogleAuth, setShowGoogleAuth } = useGoogleOAuth({ setStatus, t });
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([]);
  const [showBackupList, setShowBackupList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileToDelete, setFileToDelete] = useState<BackupFile | null>(null);
  const itemsPerPage = 5;

  useDeleteBackupConfirmation(
    fileToDelete,
    googleAccessToken,
    setShowGoogleAuth,
    setShowBackupList,
    setBackupFiles,
    setCurrentPage,
    setFileToDelete
  );

  return (
    <>
      {showBackupList && backupFiles.length > 0 ? (
        <BackupList
          backupFiles={backupFiles}
          status={status}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          googleAccessToken={googleAccessToken}
          setShowBackupList={setShowBackupList}
          setShowGoogleAuth={setShowGoogleAuth}
          setStatus={setStatus}
          setCurrentPage={setCurrentPage}
          setFileToDelete={setFileToDelete}
        />
      ) : (
        <>
          <BackupStatusMessage message={status.message} messageType={status.messageType} />
          <BackupActions
            status={status}
            showGoogleAuth={showGoogleAuth}
            googleAccessToken={googleAccessToken}
            setStatus={setStatus}
            setShowGoogleAuth={setShowGoogleAuth}
            setBackupFiles={setBackupFiles}
            setShowBackupList={setShowBackupList}
          />
        </>
      )}
    </>
  );
};
