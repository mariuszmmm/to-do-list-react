import { jsonResponse } from "./response";

/**
 * Gets a fresh access token using a refresh token
 */
export const getGoogleAccessToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string | null> => {
  try {
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
    return data.access_token;
  } catch (error) {
    console.error("[getGoogleAccessToken] Error refreshing token:", error);
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
