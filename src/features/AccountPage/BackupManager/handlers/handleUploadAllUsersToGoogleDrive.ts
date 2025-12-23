import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/getUserToken";
import { uploadAllUsersToGoogleDriveApi } from "../../../../api/backupApi";
import { translateText } from "../../../../utils/translateText";
import i18n from "../../../../utils/i18n";

export const handleUploadAllUsersToGoogleDrive = async (
  googleAccessToken: string | null,
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
  setShowGoogleAuth: (show: boolean) => void
): Promise<void> => {
  try {
    const token = await getUserToken();
    if (!token) throw new Error("No user token");

    if (!googleAccessToken) {
      setStatus({
        isLoading: false,
        message: t("uploadAllUsersToGoogleDrive.notAuthorized"),
        messageType: "error",
      });
      setShowGoogleAuth(true);
      return;
    }

    setStatus({
      isLoading: true,
      message: t("uploadAllUsersToGoogleDrive.uploading"),
      messageType: "info",
    });

    const result = await uploadAllUsersToGoogleDriveApi(
      token,
      googleAccessToken
    );
    if (!result.success) throw new Error(result.message);

    setStatus({
      isLoading: false,
      message: t("uploadAllUsersToGoogleDrive.success"),
      messageType: "success",
    });
  } catch (error: any) {
    console.error("[handleUploadAllUsersToGoogleDrive]", error);
    setShowGoogleAuth(true);

    const msg = typeof error.message === "string" ? error.message : "";
    const translatedText = msg
      ? await translateText(msg, i18n.language)
      : t("uploadAllUsersToGoogleDrive.error");

    setStatus({
      isLoading: false,
      message: translatedText,
      messageType: "error",
    });
  }
};
