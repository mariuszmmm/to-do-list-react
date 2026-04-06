import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import { uploadAllUsersToGoogleDriveApi } from "../../../../api/backupApi";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";

export const handleUploadAllUsersToGoogleDrive = async (
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
  setShowGoogleAuth?: (show: boolean) => void,
): Promise<void> => {
  try {
    const token = await getUserToken();
    if (!token) throw new Error("No user token");

    setStatus({
      isLoading: true,
      message: t("uploadAllUsersToGoogleDrive.uploading"),
      messageType: "info",
    });

    const result = await uploadAllUsersToGoogleDriveApi(token);
    if (!result.success) throw result;

    setStatus({
      isLoading: false,
      message: t("uploadAllUsersToGoogleDrive.success"),
      messageType: "success",
    });
  } catch (error: unknown) {
    console.error("[handleUploadAllUsersToGoogleDrive]", error);

    const msg = error instanceof Error ? error.message : "";
    const translatedText =
      (msg ? await translateText(msg, i18n.language) : null) ||
      t("uploadAllUsersToGoogleDrive.error");

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
