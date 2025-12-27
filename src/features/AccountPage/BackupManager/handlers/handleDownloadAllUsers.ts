import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/getUserToken";
import { downloadAllUsersApi } from "../../../../api/backupApi";
import { saveBackupToFile } from "../../../../utils/saveBackupToFile";
import { translateText } from "../../../../utils/translateText";
import i18n from "../../../../utils/i18n";

export const handleDownloadAllUsers = async (
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void
): Promise<void> => {
  try {
    setStatus({
      isLoading: true,
      message: t("downloadAllUsers.downloading"),
      messageType: "info",
    });

    const token = await getUserToken();
    if (!token) {
      throw new Error("No user token");
    }

    const result = await downloadAllUsersApi(token);
    if (!result.success || !result.data) {
      throw new Error(result.message);
    }

    const { backupData } = result.data;
    const saved = saveBackupToFile(backupData);
    if (!saved) {
      throw new Error("Error saving backup file");
    }

    setStatus({
      isLoading: false,
      message: t("downloadAllUsers.success"),
      messageType: "success",
    });
  } catch (error: any) {
    console.error("[downloadAllUsers]", error);
    const msg = typeof error.message === "string" ? error.message : "";
    const translatedText = msg
      ? await translateText(msg, i18n.language)
      : t("downloadAllUsers.error");
    setStatus({
      isLoading: false,
      message: translatedText,
      messageType: "error",
    });
  }
};
