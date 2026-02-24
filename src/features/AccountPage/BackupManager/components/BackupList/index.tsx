import React from "react";
import {
  BackupListTitle,
  BackupItem,
  BackupFileName,
  BackupFileDate,
  BackupFileInfo,
  BackupActionsContainer,
  BackupItemsContainer,
  BackupListContainer,
} from "../../styled";
import { RemoveButton } from "../../../../../common/taskButtons";
import { useTranslation } from "react-i18next";
import { handleRestoreBackupConfirmation } from "../../handlers/handleRestoreBackupConfirmation";
import { handleDeleteBackupConfirmation } from "../../handlers/handleDeleteBackupConfirmation";
import { useAppDispatch } from "../../../../../hooks";
import { BackupFile } from "../../../../../types";
import {
  ArrowIcon,
  PaginationButton,
  PaginationContainer,
  PaginationInfo,
  PaginationLabel,
} from "../../../../../common/Pagination";

interface BackupListProps {
  backupFiles: Array<BackupFile>;
  status: { isLoading: boolean };
  currentPage: number;
  itemsPerPage: number;
  setShowBackupList: (show: boolean) => void;
  setStatus: (status: any) => void;
  setCurrentPage: (page: number) => void;
  setFileToDelete: (file: BackupFile | null) => void;
  setFileToRestore: (file: BackupFile | null) => void;
  setShowGoogleAuth: (show: boolean) => void;
}

export const BackupList: React.FC<BackupListProps> = ({
  backupFiles,
  status,
  currentPage,
  itemsPerPage,
  setShowBackupList,
  setStatus,
  setCurrentPage,
  setFileToDelete,
  setFileToRestore,
  setShowGoogleAuth,
}) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.backup",
  });
  const dispatch = useAppDispatch();

  return (
    <BackupListContainer>
      <BackupListTitle>
        {t("listGoogleDriveBackups.selectBackup")}
      </BackupListTitle>
      <BackupItemsContainer>
        {backupFiles
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((file) => (
            <BackupItem
              key={file.id}
              onClick={() =>
                !status.isLoading &&
                handleRestoreBackupConfirmation(
                  file.id,
                  file.name,
                  setFileToRestore,
                  dispatch,
                )
              }
              $isLoading={status.isLoading}
              title={t("listGoogleDriveBackups.tooltips.restore")}
            >
              <BackupFileInfo>
                <BackupFileName>{file.name}</BackupFileName>
                {file.modifiedTime && (
                  <BackupFileDate>
                    🕐{" "}
                    {new Date(file.modifiedTime).toLocaleString("pl-PL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </BackupFileDate>
                )}
              </BackupFileInfo>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBackupConfirmation(
                    file.id,
                    file.name,
                    setFileToDelete,
                    dispatch,
                  );
                }}
                disabled={status.isLoading}
                title={t("listGoogleDriveBackups.tooltips.delete")}
              >
                🗑️
              </RemoveButton>
            </BackupItem>
          ))}
      </BackupItemsContainer>
      <BackupActionsContainer>
        {Math.ceil(backupFiles.length / itemsPerPage) > 1 && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || status.isLoading}
            >
              <ArrowIcon $left>➜</ArrowIcon>
              <PaginationLabel>
                {t("listGoogleDriveBackups.buttons.prev")}
              </PaginationLabel>
            </PaginationButton>
            <PaginationInfo>
              {currentPage} / {Math.ceil(backupFiles.length / itemsPerPage)}
            </PaginationInfo>
            <PaginationButton
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(backupFiles.length / itemsPerPage),
                    currentPage + 1,
                  ),
                )
              }
              disabled={
                currentPage === Math.ceil(backupFiles.length / itemsPerPage) ||
                status.isLoading
              }
            >
              <PaginationLabel>
                {t("listGoogleDriveBackups.buttons.next")}
              </PaginationLabel>
              <ArrowIcon>➜</ArrowIcon>
            </PaginationButton>
          </PaginationContainer>
        )}
        <PaginationButton
          $cancel
          onClick={() => {
            setShowBackupList(false);
            setStatus({
              isLoading: false,
              message: "",
              messageType: "info",
            });
            setCurrentPage(1);
          }}
          disabled={status.isLoading}
        >
          {t("listGoogleDriveBackups.buttons.cancel")}
        </PaginationButton>
      </BackupActionsContainer>
    </BackupListContainer>
  );
};
