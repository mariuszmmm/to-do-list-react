import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import { fetchGoogleDriveBackupListApi } from "../../../../api/backupApi";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";
import { BackupFile } from "../../../../types";

export const handleFetchGoogleDriveBackupList = async (
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
  setBackupFiles: (files: BackupFile[]) => void,
  setShowBackupList: (show: boolean) => void,
  setShowGoogleAuth?: (show: boolean) => void,
): Promise<void> => {
  try {
    const token = await getUserToken();
    if (!token) throw new Error("No user token");

    setStatus({
      isLoading: true,
      message: t("listGoogleDriveBackups.loading"),
      messageType: "info",
    });

    const result = await fetchGoogleDriveBackupListApi(token);

    if (!result.success || !result.data || !result.data.files) {
      throw result;
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
    setStatus({
      isLoading: false,
      message: "",
      messageType: "info",
    });
    setShowBackupList(true);
  } catch (error: unknown) {
    console.error("[handleFetchGoogleDriveBackupList]", error);
    const msg = error instanceof Error ? error.message : "";
    const translatedText =
      (msg ? await translateText(msg, i18n.language) : null) ||
      t("listGoogleDriveBackups.error");
    if (
      error &&
      typeof error === "object" &&
      "source" in error &&
      error.source === "google-drive"
    ) {
      setShowGoogleAuth?.(true);
    }

    setStatus({
      isLoading: false,
      message: translatedText,
      messageType: "error",
    });
  }
};
