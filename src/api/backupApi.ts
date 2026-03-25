import axios from "axios";
import { BackupData, BackupFile } from "../types";
type ApiResponse<T = undefined> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  source?: string;
};

const makeErrorResponse = <T>(error: any): ApiResponse<T> => {
  const msg =
    error?.response?.data?.error?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Unknown error occurred";
  const source = error?.response?.data?.source;
  return {
    success: false,
    statusCode: error?.response?.status || 500,
    message: msg,
    ...(source && { source }),
  };
};

export const downloadUserListsApi = async (
  token: string,
): Promise<ApiResponse<{ backupData: BackupData }>> => {
  try {
    const response = await axios.get("/backup-download-user", {
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

export const downloadAllUsersApi = async (
  token: string,
): Promise<ApiResponse<{ backupData: BackupData }>> => {
  try {
    const response = await axios.get("/backup-download-all", {
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
      "/backup-restore-user",
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
      "/backup-restore-all",
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

export const uploadAllUsersToGoogleDriveApi = async (
  token: string,
): Promise<ApiResponse> => {
  try {
    let response = await axios.post(
      "/backup-upload-drive",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Error uploading backup to Google Drive", error);
    return makeErrorResponse(error);
  }
};

export const fetchGoogleDriveBackupListApi = async (
  token: string,
): Promise<ApiResponse<{ files?: BackupFile[] }>> => {
  try {
    const response = await axios.post(
      "/backup-list-drive",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error listing Google Drive files", error);
    return makeErrorResponse(error);
  }
};

export const deleteBackupFromGoogleDriveApi = async (
  token: string,
  fileId: string,
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      "/backup-delete-drive",
      { fileId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Error deleting backup from Google Drive", error);
    return makeErrorResponse(error);
  }
};

export const restoreSelectedBackupFromGoogleDriveApi = async (
  token: string,
  fileId: string,
): Promise<ApiResponse<{ restored: number; failed: number }>> => {
  try {
    await axios.post(
      "/backup-upload-drive",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    let response = await axios.post(
      "/backup-restore-drive",
      { fileId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    console.error("[restoreBackupFromGoogleDriveApi]", error);
    return makeErrorResponse(error);
  }
};

export const getSystemStatusApi = async (
  token: string,
): Promise<
  ApiResponse<{
    status: { status: string; details?: string; timestamp?: string };
    cleanupStatus: {
      status: string;
      details?: string;
      timestamp?: string;
      stats?: any;
    };
    stats: {
      totalUsers: number;
      totalLists: number;
      totalTasks: number;
    };
    storageStats?: {
      storage: {
        used: number;
        limit: number;
        used_percent: number;
        usage_gb: string;
        limit_gb: string;
      };
      objects: {
        used: number;
        limit: number;
      };
    };
    logs: Array<{
      key: string;
      status: string;
      details?: string;
      timestamp: string;
      stats?: any;
    }>;
    netlifyStats?: {
      bandwidth: { used: number; included: number; used_percent: number };
      credits: { used: number; included: number; used_percent: number };
      concurrent_builds: {
        used: number;
        included: number;
        max: number;
        used_percent: number;
      };
      site_name: string;
      last_deploy_at: string | null;
    };
    ablyStats?: {
      messages: { used: number; limit: number };
      connections: { used: number; limit: number };
    };
  }>
> => {
  try {
    const response = await axios.get("/system-status", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message || "System status fetched",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching system status", error);
    return makeErrorResponse(error);
  }
};

export const runCleanupApi = async (
  token: string,
): Promise<ApiResponse<any>> => {
  try {
    // Najpierw uruchom czyszczenie tymczasowych obrazów
    await axios.post(
      "/cleanup-temp-images",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // Następnie uruchom czyszczenie "osieroconych" obrazów
    const response = await axios.post(
      "/cleanup-orphan-images",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error running cleanup", error);
    return makeErrorResponse(error);
  }
};

export const runDeletedTasksCleanupApi = async (
  token: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      "/cleanup-deleted-tasks",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error running deleted tasks cleanup", error);
    return makeErrorResponse(error);
  }
};

export const diagnoseSystemApi = async (
  token: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get("/system-diagnose", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message || "Diagnosis completed",
      data: response.data.results,
    };
  } catch (error: any) {
    console.error("Error running diagnosis", error);
    return makeErrorResponse(error);
  }
};
export const runLogsCleanupApi = async (
  token: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      "/cleanup-logs",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error running logs cleanup", error);
    return makeErrorResponse(error);
  }
};
export const inviteUserApi = async (
  token: string,
  email: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      "/user-invite",
      { email },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return {
      success: true,
      statusCode: response.status,
      message: response.data.message || "Invitation sent successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error inviting user", error);
    return makeErrorResponse(error);
  }
};

export type UserListItem = { email: string; account: "active" | "deleted" | "pending" };

export const getUsersListApi = async (
  token: string,
): Promise<ApiResponse<{ users: UserListItem[] }>> => {
  try {
    const response = await axios.get("/user-list", {
      params: { t: Date.now() },
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      statusCode: response.status,
      message: "OK",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching users list", error);
    return makeErrorResponse(error);
  }
};

export const adminDeleteUserApi = async (
  token: string,
  email: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete("/user-admin-delete", {
      headers: { Authorization: `Bearer ${token}` },
      data: { email },
    });
    return {
      success: true,
      statusCode: response.status,
      message: response.data.message || "User deleted successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error deleting user", error);
    return makeErrorResponse(error);
  }
};
