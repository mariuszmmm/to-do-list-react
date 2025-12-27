import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/getUserToken";
import { downloadUserListsApi } from "../../../../api/backupApi";
import { saveBackupToFile } from "../../../../utils/saveBackupToFile";
import { translateText } from "../../../../utils/translateText";
import i18n from "../../../../utils/i18n";

export const handleDownloadUserLists = async (
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void
) => {
  try {
    setStatus({
      isLoading: true,
      message: t("downloadUserLists.downloading"),
      messageType: "info",
    });

    const token = await getUserToken();
    if (!token) {
      throw new Error("No user token");
    }

    const result = await downloadUserListsApi(token);
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
      message: t("downloadUserLists.success"),
      messageType: "success",
    });
  } catch (error: any) {
    console.error("[downloadUserLists]", error);
    const msg = typeof error.message === "string" ? error.message : "";
    const translatedText = msg
      ? await translateText(msg, i18n.language)
      : t("downloadUserLists.error");
    setStatus({
      isLoading: false,
      message: translatedText,
      messageType: "error",
    });
  }
};
