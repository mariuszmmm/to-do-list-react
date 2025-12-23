import { TFunction } from "i18next";
import { StatusState } from "..";
import { useEffect, useState } from "react";
import { exchangeGoogleOAuthCodeApi } from "../../../../api/googleOAuthApi";

export function useGoogleOAuth({
  setStatus,
  t,
}: {
  setStatus: (status: StatusState) => void;
  t: TFunction<"translation", "accountPage.backup">;
}) {
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    () => sessionStorage.getItem("google_drive_access_token")
  );
  const [showGoogleAuth, setShowGoogleAuth] = useState(!googleAccessToken);
  useEffect(() => {
    const code = sessionStorage.getItem("google_oauth_code");
    if (code) {
      sessionStorage.removeItem("google_oauth_code");
      (async () => {
        try {
          const data = await exchangeGoogleOAuthCodeApi(code);
          sessionStorage.setItem("google_drive_access_token", data.accessToken);
          if (data.refreshToken) {
            sessionStorage.setItem(
              "google_drive_refresh_token",
              data.refreshToken
            );
          }
          setGoogleAccessToken(data.accessToken);
          setShowGoogleAuth(false);
          setStatus({
            isLoading: false,
            message: t("authorizeGoogle.success"),
            messageType: "success",
          });
        } catch (error) {
          !showGoogleAuth && setShowGoogleAuth(true);
          setStatus({
            isLoading: false,
            message: t("authorizeGoogle.error"),
            messageType: "error",
          });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { googleAccessToken, showGoogleAuth, setShowGoogleAuth };
}
