import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { BackupFile } from "../../../../types";

export const handleDeleteBackupConfirmation = (
  fileId: string,
  fileName: string,
  setFileToDelete: (file: BackupFile | null) => void,
  dispatch: ReturnType<typeof useAppDispatch>
): void => {
  setFileToDelete({ id: fileId, name: fileName });

  dispatch(
    openModal({
      title: { key: "modal.deleteBackup.title" },
      message: {
        key: "modal.deleteBackup.message.confirm",
        values: { name: fileName },
      },
      type: "confirm",
      confirmButton: { key: "modal.buttons.deleteButton" },
    })
  );
};
