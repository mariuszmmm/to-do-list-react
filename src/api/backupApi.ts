import axios from "axios";
import { BackupData, BackupFile } from "../types";
import { refreshGoogleAccessToken } from "../utils/googleDrive/refreshGoogleAccessToken";

type ApiResponse<T = undefined> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
};

const makeErrorResponse = <T>(error: any): ApiResponse<T> => {
  const msg = error?.response?.data?.message || error?.message || "Unknown error occurred";
  return {
    success: false,
    statusCode: error?.response?.status || 500,
    message: msg,
  };
};

export const downloadUserListsApi = async (token: string): Promise<ApiResponse<{ backupData: BackupData }>> => {
  try {
    const response = await axios.get("/backup-downloadUserLists", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[downloadUserListsApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error downloading user lists", error);
    return makeErrorResponse(error);
  }
};

export const downloadAllUsersApi = async (token: string): Promise<ApiResponse<{ backupData: BackupData }>> => {
  try {
    const response = await axios.get("/backup-downloadAllUsers", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[downloadAllUsersApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error downloading all users", error);
    return makeErrorResponse(error);
  }
};

export const restoreUserListsApi = async (
  token: string,
  backupData: BackupData,
): Promise<ApiResponse<{ listsCount: number }>> => {
  try {
    const response = await axios.post(
      "/backup-restoreUserLists",
      { backupData },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[restoreUserListsApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error restoring user lists", error);
    return makeErrorResponse(error);
  }
};

export const restoreAllUsersApi = async (
  token: string,
  backupData: BackupData,
): Promise<ApiResponse<{ restored: number; failed: number }>> => {
  try {
    const response = await axios.post(
      "/backup-restoreAllUsers",
      { backupData },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[restoreAllUsersApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error restoring all users", error);
    return makeErrorResponse(error);
  }
};

export const uploadAllUsersToGoogleDriveApi = async (token: string, accessToken: string): Promise<ApiResponse> => {
  try {
    let currentAccessToken = accessToken;
    let response = await axios.post(
      "/backup-uploadAllUsersToGoogleDrive",
      { accessToken: currentAccessToken },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[uploadAllUsersToGoogleDriveApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (error.response?.data?.source !== "google-drive") throw new Error(error.response?.data?.message);

      if (process.env.NODE_ENV === "development") {
        console.log("[uploadAllUsersToGoogleDriveApi] Token expired, refreshing...");
      }

      const newAccessToken = await refreshGoogleAccessToken();
      if (!newAccessToken) throw new Error("Google Drive authorization expired. Please authorize again.");

      let retryResponse = await axios.post(
        "/backup-uploadAllUsersToGoogleDrive",
        { accessToken: newAccessToken },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return {
        success: true,
        statusCode: retryResponse.status,
        message: retryResponse.statusText,
      };
    }

    console.error("Error uploading backup to Google Drive", error);
    return makeErrorResponse(error);
  }
};

export const fetchGoogleDriveBackupListApi = async (
  accessToken: string,
): Promise<ApiResponse<{ files?: BackupFile[] }>> => {
  try {
    let currentAccessToken = accessToken;
    let folderResponse = await axios.get(
      "https://www.googleapis.com/drive/v3/files?q=name='to-do-list-backup' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)",
      { headers: { Authorization: `Bearer ${currentAccessToken}` } },
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[fetchGoogleDriveBackupListApi] folderResponse:", folderResponse);
    }
    if (!folderResponse.data?.files || folderResponse.data.files.length === 0) {
      return {
        success: false,
        statusCode: folderResponse.status,
        message: "Backup folder not found in Google Drive",
      };
    }
    const folderId = folderResponse.data.files[0].id;

    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains 'backup-' and mimeType='application/json' and trashed=false&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)`,
      { headers: { Authorization: `Bearer ${currentAccessToken}` } },
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[fetchGoogleDriveBackupListApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (process.env.NODE_ENV === "development") {
        console.log("[fetchGoogleDriveBackupListApi ] Token expired, refreshing...");
      }

      const newAccessToken = await refreshGoogleAccessToken();
      if (!newAccessToken) throw new Error("Google Drive authorization expired. Please authorize again.");

      let retryFolderResponse = await axios.get(
        "https://www.googleapis.com/drive/v3/files?q=name='to-do-list-backup' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)",
        { headers: { Authorization: `Bearer ${newAccessToken}` } },
      );
      if (!retryFolderResponse.data?.files || retryFolderResponse.data.files.length === 0) {
        return {
          success: false,
          statusCode: retryFolderResponse.status,
          message: "Backup folder not found in Google Drive",
        };
      }
      const folderId = retryFolderResponse.data.files[0].id;

      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains 'backup-' and mimeType='application/json' and trashed=false&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)`,
        { headers: { Authorization: `Bearer ${newAccessToken}` } },
      );
      if (process.env.NODE_ENV === "development") {
        console.log("[fetchGoogleDriveBackupListApi] response:", response);
      }

      return {
        success: true,
        statusCode: response.status,
        message: response.statusText,
        data: response.data,
      };
    }
    console.error("Error listing Google Drive files", error);
    return makeErrorResponse(error);
  }
};

export const deleteBackupFromGoogleDriveApi = async (accessToken: string, fileId: string): Promise<ApiResponse> => {
  try {
    let currentAccessToken = accessToken;
    let response = await axios.delete(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers: { Authorization: `Bearer ${currentAccessToken}` },
    });
    if (process.env.NODE_ENV === "development") {
      console.log("[deleteBackupFromGoogleDriveApi] response:", response);
    }
    return {
      success: true,
      statusCode: response.status,
      message: response.statusText,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.log("[deleteBackupFromGoogleDriveApi] Token expired, refreshing...");
      const newAccessToken = await refreshGoogleAccessToken();
      if (!newAccessToken) {
        throw new Error("Google Drive authorization expired. Please authorize again.");
      }
      let retryResponse = await axios.delete(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });

      return {
        success: true,
        statusCode: retryResponse.status,
        message: retryResponse.statusText,
      };
    }

    console.error("Error deleting backup from Google Drive", error);
    return makeErrorResponse(error);
  }
};

export const restoreSelectedBackupFromGoogleDriveApi = async (
  token: string,
  fileId: string,
  accessToken: string,
): Promise<ApiResponse<{ restored: number; failed: number }>> => {
  try {
    let currentAccessToken = accessToken;
    let response = await axios.post(
      "/backup-restoreBackupFromGoogleDrive",
      { fileId, accessToken: currentAccessToken },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (process.env.NODE_ENV === "development") {
      console.log("[restoreBackupFromGoogleDriveApi] response:", response);
    }

    return {
      success: true,
      statusCode: response.status,
      message: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (error.response?.data?.source !== "google-drive") throw new Error(error.response?.data?.message);
      if (process.env.NODE_ENV === "development") {
        console.log("[restoreBackupFromGoogleDriveApi] Token expired, refreshing...");
      }

      const newAccessToken = await refreshGoogleAccessToken();
      if (!newAccessToken) {
        throw new Error("Google Drive authorization expired. Please authorize again.");
      }

      let retryResponse = await axios.post(
        "/backup-restoreBackupFromGoogleDrive",
        { fileId, accessToken: newAccessToken },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return {
        success: true,
        statusCode: retryResponse.status,
        message: retryResponse.statusText,
        data: retryResponse.data,
      };
    }
    console.error("[restoreBackupFromGoogleDriveApi]", error);
    return makeErrorResponse(error);
  }
};
