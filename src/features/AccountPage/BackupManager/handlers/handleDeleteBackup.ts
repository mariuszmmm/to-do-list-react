import { TFunction } from "i18next";
import {
  deleteBackupFromGoogleDriveApi,
  fetchGoogleDriveBackupListApi,
} from "../../../../api/backupApi";
import i18n from "../../../../utils/i18n";
import { translateText } from "../../../../api/translateTextApi";
import { BackupFile } from "../../../../types";
import { getUserToken } from "../../../../utils/auth/getUserToken";

export const handleDeleteBackup = async (
  fileId: string,
  t: TFunction<"translation", "accountPage.backup">,
  setShowBackupList: (show: boolean) => void,
  setBackupFiles: (files: BackupFile[]) => void,
  setCurrentPage: (number: number) => void,
  setShowGoogleAuth?: (show: boolean) => void,
) => {
  try {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No user token");
    }

    const deleteResult = await deleteBackupFromGoogleDriveApi(token, fileId);

    if (!deleteResult.success) {
      throw deleteResult;
    }

    const result = await fetchGoogleDriveBackupListApi(token);

    if (!result.success || !result.data || !result.data.files) {
      throw result;
    }

    setBackupFiles(result.data.files);
    setCurrentPage(1);

    return { success: true };
  } catch (error: unknown) {
    console.error("[DeleteBackup]", error);

    const msg = error instanceof Error ? error.message : "";
    const translatedText =
      (msg && typeof msg === "string"
        ? await translateText(msg, i18n.language)
        : null) || t("listGoogleDriveBackups.errorDelete");

    if (
      error &&
      typeof error === "object" &&
      "source" in error &&
      (error as any).source === "google-drive"
    ) {
      setShowGoogleAuth?.(true);
    }

    return { success: false, message: translatedText };
  }
};
