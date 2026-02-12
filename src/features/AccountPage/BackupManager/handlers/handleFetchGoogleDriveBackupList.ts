import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import { fetchGoogleDriveBackupListApi } from "../../../../api/backupApi";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";
import { BackupFile } from "../../../../types";

export const handleFetchGoogleDriveBackupList = async (
  googleAccessToken: string | null,
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
  setShowGoogleAuth: (show: boolean) => void,
  setBackupFiles: (files: BackupFile[]) => void,
  setShowBackupList: (show: boolean) => void,
): Promise<void> => {
  try {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No user token");
    }

    if (!googleAccessToken) {
      setStatus({
        isLoading: false,
        message: t("listGoogleDriveBackups.notAuthorized"),
        messageType: "error",
      });
      setShowGoogleAuth(true);
      return;
    }

    const result = await fetchGoogleDriveBackupListApi({ token, googleAccessToken });

    if (!result.success || !result.data || !result.data.files) {
      throw new Error(result.message);
    }

    const { files } = result.data;
    if (files.length === 0) {
      setStatus({
        isLoading: false,
        message: t("listGoogleDriveBackups.noBackups"),
        messageType: "error",
      });
      return;
    }

    setBackupFiles(files);
    setShowBackupList(true);
  } catch (error: unknown) {
    console.error("[handleFetchGoogleDriveBackupList]", error);
    setShowGoogleAuth(true);
    const msg = error instanceof Error ? error.message : "";
    const translatedText = (msg ? await translateText(msg, i18n.language) : null) || t("listGoogleDriveBackups.error");
    setStatus({
      isLoading: false,
      message: translatedText,
      messageType: "error",
    });
  }
};
