import { getUserToken } from "../auth/getUserToken";
import { refreshGoogleTokenApi } from "../../api/googleOAuthApi";

export const refreshGoogleAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("google_drive_refresh_token");
    if (!refreshToken) {
      console.warn("[refreshGoogleAccessToken] No refresh token available");
      return null;
    }

    const userToken = await getUserToken();
    if (!userToken) {
      console.error("[refreshGoogleAccessToken] No user token");
      return null;
    }

    const data = await refreshGoogleTokenApi(refreshToken, userToken);
    localStorage.setItem("google_drive_access_token", data.accessToken);

    return data.accessToken;
  } catch (error) {
    localStorage.removeItem("google_drive_access_token");
    localStorage.removeItem("google_drive_refresh_token");
    return null;
  }
};
