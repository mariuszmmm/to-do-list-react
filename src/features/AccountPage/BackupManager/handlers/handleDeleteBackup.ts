import { TFunction } from "i18next";
import {
  deleteBackupFromGoogleDriveApi,
  fetchGoogleDriveBackupListApi,
} from "../../../../api/backupApi";
import i18n from "../../../../utils/i18n";
import { translateText } from "../../../../api/translateTextApi";
import { BackupFile } from "../../../../types";

export const handleDeleteBackup = async (
  fileId: string,
  googleAccessToken: string,
  t: TFunction<"translation", "accountPage.backup">,
  setShowGoogleAuth: (show: boolean) => void,
  setShowBackupList: (show: boolean) => void,
  setBackupFiles: (files: BackupFile[]) => void,
  setCurrentPage: (number: number) => void,
) => {
  try {
    if (!googleAccessToken) {
      setShowGoogleAuth(true);
      setShowBackupList(false);
      return {
        success: false,
        message: i18n.t(
          "accountPage.backup.listGoogleDriveBackups.notAuthorized",
        ),
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[DeleteBackup] Calling deleteBackupFromGoogleDriveApi");
    }

    const deleteResult = await deleteBackupFromGoogleDriveApi(
      googleAccessToken,
      fileId,
    );

    if (!deleteResult.success) {
      throw new Error(deleteResult.message);
    }

    const result = await fetchGoogleDriveBackupListApi(googleAccessToken);

    if (!result.success || !result.data || !result.data.files) {
      throw new Error(result.message);
    }

    setBackupFiles(result.data.files);
    setCurrentPage(1);

    return { success: true };
  } catch (error: unknown) {
    console.error("[DeleteBackup]", error);
    setShowGoogleAuth(true);

    const msg = error instanceof Error ? error.message : "";
    const translatedText =
      (msg ? await translateText(msg, i18n.language) : null) ||
      t("listGoogleDriveBackups.errorDelete");

    return { success: false, message: translatedText };
  }
};
