import { getUserToken } from "./getUserToken";
import { refreshGoogleTokenApi } from "../api/googleOAuthApi";

export const refreshGoogleAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = sessionStorage.getItem("google_drive_refresh_token");
    if (!refreshToken) {
      console.warn("[refreshGoogleAccessToken] No refresh token available");
      return null;
    }

    const userToken = await getUserToken();
    if (!userToken) {
      console.error("[refreshGoogleAccessToken] No user token");
      return null;
    }

    console.log("[refreshGoogleAccessToken] Refreshing Google access token...");
    const data = await refreshGoogleTokenApi(refreshToken, userToken);
    sessionStorage.setItem("google_drive_access_token", data.accessToken);
    console.log("[refreshGoogleAccessToken] Token refreshed successfully");

    return data.accessToken;
  } catch (error) {
    console.error("[refreshGoogleAccessToken] Failed to refresh token:", error);
    sessionStorage.removeItem("google_drive_access_token");
    sessionStorage.removeItem("google_drive_refresh_token");
    return null;
  }
};
