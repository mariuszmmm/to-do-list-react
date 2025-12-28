import React from "react";
import { BackupListContainer } from "../../../../../common/BackupListContainer";
import {
  BackupListTitle,
  BackupItem,
  BackupFileName,
  BackupFileDate,
  BackupFileInfo,
  BackupActionsContainer,
  BackupItemsContainer,
} from "../../styled";
import { PaginationContainer, PaginationButton, PaginationInfo, ArrowIcon, PaginationLabel } from "../../../../../common/Pagination";
import { RemoveButton } from "../../../../../common/taskButtons";
import { useTranslation } from "react-i18next";
import { handleRestoreBackupFromGoogleDrive } from "../../handlers/handleRestoreBackupFromGoogleDrive";
import { handleDeleteBackupConfirmation } from "../../handlers/handleDeleteBackupConfirmation";
import { useAppDispatch } from "../../../../../hooks";
import { BackupFile } from "../../../../../types";

interface BackupListProps {
  backupFiles: Array<BackupFile>;
  status: { isLoading: boolean };
  currentPage: number;
  itemsPerPage: number;
  googleAccessToken: string | null;
  setShowBackupList: (show: boolean) => void;
  setShowGoogleAuth: (show: boolean) => void;
  setStatus: (status: any) => void;
  setCurrentPage: (page: number) => void;
  setFileToDelete: (file: BackupFile | null) => void;
}

export const BackupList: React.FC<BackupListProps> = ({
  backupFiles,
  status,
  currentPage,
  itemsPerPage,
  googleAccessToken,
  setShowBackupList,
  setShowGoogleAuth,
  setStatus,
  setCurrentPage,
  setFileToDelete,
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "accountPage.backup", });
  const dispatch = useAppDispatch();

  return (
    <BackupListContainer>
      <BackupListTitle>{t("listGoogleDriveBackups.selectBackup")}</BackupListTitle>
      <BackupItemsContainer>
        {backupFiles
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((file) => (
            <BackupItem
              key={file.id}
              onClick={() => !status.isLoading && googleAccessToken && handleRestoreBackupFromGoogleDrive(
                file.id,
                googleAccessToken,
                t,
                setStatus,
                setShowBackupList,
                setShowGoogleAuth
              )
              }
              $isLoading={status.isLoading}
              title={t("listGoogleDriveBackups.tooltips.restore")}
            >
              <BackupFileInfo>
                <BackupFileName>{file.name}</BackupFileName>
                {file.modifiedTime && <BackupFileDate>
                  🕐 {new Date(file.modifiedTime).toLocaleString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </BackupFileDate>}
              </BackupFileInfo>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBackupConfirmation(
                    file.id,
                    file.name,
                    setFileToDelete,
                    dispatch
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
              <PaginationLabel>{t("listGoogleDriveBackups.buttons.prev")}</PaginationLabel>
            </PaginationButton>
            <PaginationInfo>
              {currentPage} / {Math.ceil(backupFiles.length / itemsPerPage)}
            </PaginationInfo>
            <PaginationButton
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(backupFiles.length / itemsPerPage),
                    currentPage + 1
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(backupFiles.length / itemsPerPage) ||
                status.isLoading
              }
            >
              <PaginationLabel>{t("listGoogleDriveBackups.buttons.next")}</PaginationLabel>
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
}
