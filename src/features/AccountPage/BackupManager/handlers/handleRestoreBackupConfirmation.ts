import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { BackupFile } from "../../../../types";

export const handleRestoreBackupConfirmation = (
  fileId: string,
  fileName: string,
  setFileToRestore: (file: BackupFile | null) => void,
  dispatch: ReturnType<typeof useAppDispatch>,
): void => {
  setFileToRestore({ id: fileId, name: fileName });

  dispatch(
    openModal({
      title: { key: "modal.restoreBackup.title" },
      message: {
        key: "modal.restoreBackup.message.confirm",
        values: { name: fileName },
      },
      type: "confirm",
      confirmButton: { key: "modal.buttons.confirmButton" },
    }),
  );
};
