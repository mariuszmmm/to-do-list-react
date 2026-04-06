import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import { restoreSelectedBackupFromGoogleDriveApi } from "../../../../api/backupApi";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";

export const handleRestoreBackupFromGoogleDrive = async (
  fileId: string,
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
  setShowBackupList: (show: boolean) => void,
  setShowGoogleAuth?: (show: boolean) => void,
): Promise<void> => {
  try {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No user token");
    }

    setStatus({
      isLoading: true,
      message: t("restoreSelectedBackup.restoring"),
      messageType: "info",
    });
    setShowBackupList(false);

    const result = await restoreSelectedBackupFromGoogleDriveApi(token, fileId);

    if (!result.success || !result.data) {
      throw result;
    }

    const { restored, failed } = result.data;
    setStatus({
      isLoading: false,
      message: t("restoreSelectedBackup.success", {
        restored,
        failed,
        total: restored + failed,
      }),
      messageType: "success",
    });
  } catch (error: unknown) {
    console.error("[handleRestoreBackupFromGoogleDrive]", error);
    const msg = error instanceof Error ? error.message : "";
    const translatedText =
      (msg ? await translateText(msg, i18n.language) : null) ||
      t("restoreSelectedBackup.error");
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
