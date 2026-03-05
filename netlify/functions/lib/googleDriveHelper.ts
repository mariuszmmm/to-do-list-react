import { jsonResponse } from "./response";
import { connectToDB } from "../../config/mongoose";
import SystemConfig from "../../models/SystemConfig";
// Memory cache to avoid DB calls for warm function containers
let memoryCache: { token: string; expiresAt: Date } | null = null;

/**
 * Gets a fresh access token using a refresh token
 */
export const getGoogleAccessToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string | null> => {
  try {
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5-minute buffer

    // 1. Check Memory Cache (Fastest)
    if (
      memoryCache &&
      memoryCache.expiresAt.getTime() - now.getTime() > bufferTime
    ) {
      // console.log("[getGoogleAccessToken] Using memory-cached token");
      return memoryCache.token;
    }

    await connectToDB();

    // 2. Check MongoDB Cache
    const configKey = "google_drive_access_token";
    const cachedConfig = await SystemConfig.findOne({ key: configKey });

    if (cachedConfig) {
      const expirationDate = new Date(cachedConfig.value.expiresAt);
      if (expirationDate.getTime() - now.getTime() > bufferTime) {
        console.log(
          "[getGoogleAccessToken] Using cached Google access token (from MongoDB)",
        );
        // Update memory cache for next call
        memoryCache = {
          token: cachedConfig.value.token,
          expiresAt: expirationDate,
        };
        return cachedConfig.value.token;
      }
    }

    console.log(
      "[getGoogleAccessToken] Cache expired or missing. Obtaining new token from Google API...",
    );
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn("[getGoogleAccessToken] Google API error:", errorData);
      return null;
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Save to cache. Token usually expires in 3600 seconds.
    const expiresIn = data.expires_in || 3600;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Update memory cache
    memoryCache = { token: accessToken, expiresAt };

    // Update DB cache
    await SystemConfig.findOneAndUpdate(
      { key: configKey },
      {
        key: configKey,
        value: { token: accessToken, expiresAt },
        updatedAt: new Date(),
      },
      { upsert: true, returnDocument: "after" },
    );

    console.log("[getGoogleAccessToken] Successfully cached new access token.");
    return accessToken;
  } catch (error) {
    console.error(
      "[getGoogleAccessToken] Error refreshing/getting token:",
      error,
    );
    return null;
  }
};

/**
 * Lists files in a specific folder
 */
export const listFilesID = async (
  folderId: string,
  accessToken: string,
): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id, name, createdTime)&orderBy=createdTime desc`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.error("[listFiles] Failed to list files");
      return [];
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("[listFiles] Error listing files:", error);
    return [];
  }
};

/**
 * Deletes a file by ID
 */
export const deleteFile = async (
  fileId: string,
  accessToken: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.ok;
  } catch (error) {
    console.error("[deleteFile] Error deleting file:", error);
    return false;
  }
};
