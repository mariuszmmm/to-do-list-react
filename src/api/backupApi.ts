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

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (error.response?.data?.source !== "google-drive") throw new Error(error.response?.data?.message);

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

export const fetchGoogleDriveBackupListApi = async ({
  token,
  googleAccessToken,
}: {
  token: string;
  googleAccessToken: string;
}): Promise<ApiResponse<{ files?: BackupFile[] }>> => {
  try {
    const response = await axios.post(
      "/backup-fetchGoogleDriveBackupList",
      { googleAccessToken },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (error.response?.data?.source !== "google-drive") throw new Error(error.response?.data?.message);

      const newGoogleAccessToken = await refreshGoogleAccessToken();
      if (!newGoogleAccessToken) throw new Error("Google Drive authorization expired. Please authorize again.");

      try {
        const retryResponse = await axios.post(
          "/backup-fetchGoogleDriveBackupList",
          { googleAccessToken: newGoogleAccessToken },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        return {
          success: true,
          statusCode: retryResponse.status,
          message: retryResponse.data.message,
          data: retryResponse.data,
        };
      } catch (retryError: any) {
        console.error("Error listing backups after token refresh", retryError);
        return makeErrorResponse(retryError);
      }
    }
    console.error("Error listing Google Drive files", error);
    return makeErrorResponse(error);
  }
};

export const deleteBackupFromGoogleDriveApi = async ({
  token,
  googleAccessToken,
  fileId,
}: {
  token: string;
  googleAccessToken: string;
  fileId: string;
}): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      "/backup-deleteBackupFromGoogleDrive",
      { fileId, accessToken: googleAccessToken },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (error.response?.data?.source !== "google-drive") throw new Error(error.response?.data?.message);

      const newGoogleAccessToken = await refreshGoogleAccessToken();
      if (!newGoogleAccessToken) {
        throw new Error("Google Drive authorization expired. Please authorize again.");
      }

      try {
        const retryResponse = await axios.post(
          "/backup-deleteBackupFromGoogleDrive",
          { fileId, accessToken: newGoogleAccessToken },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        return {
          success: true,
          statusCode: retryResponse.status,
          message: retryResponse.data.message,
        };
      } catch (retryError: any) {
        console.error("Error deleting backup after token refresh", retryError);
        return makeErrorResponse(retryError);
      }
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

    return {
      success: true,
      statusCode: response.status,
      message: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      if (error.response?.data?.source !== "google-drive") throw new Error(error.response?.data?.message);

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
