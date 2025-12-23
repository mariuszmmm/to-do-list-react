import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
  openModal,
  closeModal,
  selectModalConfirmed,
} from "../../../../Modal/modalSlice";
import { handleDeleteBackup } from "../handlers/handleDeleteBackup";
import { t } from "i18next";
import { BackupFile } from "../../../../types";

export const useDeleteBackupConfirmation = (
  fileToDelete: BackupFile | null,
  googleAccessToken: string | null,
  setShowGoogleAuth: (show: boolean) => void,
  setShowBackupList: (show: boolean) => void,
  setBackupFiles: (files: Array<BackupFile>) => void,
  setCurrentPage: (page: number) => void,
  setFileToDelete: (file: BackupFile | null) => void
) => {
  const confirmed = useAppSelector(selectModalConfirmed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!fileToDelete || !googleAccessToken) return;

    if (confirmed) {
      dispatch(
        openModal({
          title: { key: "modal.deleteBackup.title" },
          message: { key: "modal.deleteBackup.message.loading" },
          type: "loading",
        })
      );

      handleDeleteBackup(
        fileToDelete.id,
        googleAccessToken,
        t,
        setShowGoogleAuth,
        setShowBackupList,
        setBackupFiles,
        setCurrentPage
      ).then(({ success, message }) => {
        dispatch(
          openModal({
            title: { key: "modal.deleteBackup.title" },
            message: {
              key: success
                ? "modal.deleteBackup.message.success"
                : message || "modal.deleteBackup.message.error",
            },
            type: success ? "success" : "error",
          })
        );
        setFileToDelete(null);
      });
    } else if (confirmed === false) {
      setFileToDelete(null);
      dispatch(closeModal());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileToDelete, confirmed, googleAccessToken]);
};
