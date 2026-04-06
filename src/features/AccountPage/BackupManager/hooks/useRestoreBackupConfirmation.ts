import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux/redux";
import { closeModal, selectModalConfirmed } from "../../../../Modal/modalSlice";
import { handleRestoreBackupFromGoogleDrive } from "../handlers/handleRestoreBackupFromGoogleDrive";
import { useTranslation } from "react-i18next";
import { BackupFile } from "../../../../types";
import { StatusState } from "../index";

export const useRestoreBackupConfirmation = (
  fileToRestore: BackupFile | null,
  setStatus: (status: StatusState) => void,
  setShowBackupList: (show: boolean) => void,
  setFileToRestore: (file: BackupFile | null) => void,
  setShowGoogleAuth?: (show: boolean) => void,
) => {
  const confirmed = useAppSelector(selectModalConfirmed);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.backup",
  });

  useEffect(() => {
    if (!fileToRestore) return;

    if (confirmed) {
      handleRestoreBackupFromGoogleDrive(
        fileToRestore.id,
        t,
        setStatus,
        setShowBackupList,
        setShowGoogleAuth,
      );
      setFileToRestore(null);
      dispatch(closeModal());
    } else if (confirmed === false) {
      setFileToRestore(null);
      dispatch(closeModal());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileToRestore, confirmed]);
};
