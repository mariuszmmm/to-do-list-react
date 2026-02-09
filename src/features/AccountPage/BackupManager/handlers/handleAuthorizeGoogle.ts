import { TFunction } from "i18next";
import { getGoogleOAuthUrl } from "../../../../utils/googleDrive/googleOAuth";
import { StatusState } from "..";

export function handleAuthorizeGoogle(
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
): void {
  try {
    sessionStorage.setItem("open_backup_after_oauth", "true");
    const oauthUrl = getGoogleOAuthUrl();
    if (!oauthUrl) {
      throw new Error("Failed to get OAuth URL");
    }
    window.location.href = oauthUrl;
  } catch (error) {
    setStatus({
      isLoading: false,
      message: t("authorizeGoogle.error"),
      messageType: "error",
    });
  }
}
