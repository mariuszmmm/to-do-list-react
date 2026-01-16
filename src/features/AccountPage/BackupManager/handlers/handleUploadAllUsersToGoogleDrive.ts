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
  } catch (error: unknown) {
    console.error("[handleUploadAllUsersToGoogleDrive]", error);
    setShowGoogleAuth(true);

    const msg = error instanceof Error ? error.message : "";
    const translatedText =
      (await translateText(msg, i18n.language)) ||
      t("uploadAllUsersToGoogleDrive.error");

    setStatus({
      isLoading: false,
      message: translatedText,
      messageType: "error",
    });
  }
};
