import { useState } from "react";
import { BackupList } from "./components/BackupList";
import { BackupActions } from "./components/BackupActions";
import { BackupStatusMessage } from "./components/BackupStatusMessage";
import { useTranslation } from "react-i18next";
import { useGoogleOAuth } from "./hooks/useGoogleOAuth";
import { useDeleteBackupConfirmation } from "./hooks/useDeleteBackupConfirmation";
import { useRestoreBackupConfirmation } from "./hooks/useRestoreBackupConfirmation";
import { BackupFile } from "../../../types";

export type StatusState = {
  isLoading: boolean;
  message: string;
  messageType: "success" | "error" | "info";
};

export const BackupManager = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.backup",
  });
  const [status, setStatus] = useState<StatusState>({
    isLoading: false,
    message: "",
    messageType: "info",
  });
  const { showGoogleAuth, setShowGoogleAuth } = useGoogleOAuth({
    setStatus,
    t,
  });
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([]);
  const [showBackupList, setShowBackupList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileToDelete, setFileToDelete] = useState<BackupFile | null>(null);
  const [fileToRestore, setFileToRestore] = useState<BackupFile | null>(null);
  const itemsPerPage = 5;

  useDeleteBackupConfirmation(
    fileToDelete,
    setShowBackupList,
    setBackupFiles,
    setCurrentPage,
    setFileToDelete,
    setShowGoogleAuth,
  );

  useRestoreBackupConfirmation(
    fileToRestore,
    setStatus,
    setShowBackupList,
    setFileToRestore,
    setShowGoogleAuth,
  );

  return (
    <>
      {showBackupList && backupFiles.length > 0 ? (
        <BackupList
          backupFiles={backupFiles}
          status={status}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setShowBackupList={setShowBackupList}
          setStatus={setStatus}
          setCurrentPage={setCurrentPage}
          setFileToDelete={setFileToDelete}
          setFileToRestore={setFileToRestore}
          setShowGoogleAuth={setShowGoogleAuth}
        />
      ) : (
        <>
          <BackupStatusMessage
            message={status.message}
            messageType={status.messageType}
          />
          <BackupActions
            status={status}
            setStatus={setStatus}
            setBackupFiles={setBackupFiles}
            setShowBackupList={setShowBackupList}
            showGoogleAuth={showGoogleAuth}
            setShowGoogleAuth={setShowGoogleAuth}
          />
        </>
      )}
    </>
  );
};
