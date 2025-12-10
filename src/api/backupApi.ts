// API for backup and restore operations with Google Drive

export interface BackupData {
  version: string;
  timestamp: string;
  email: string;
  lists: any[];
  totalLists: number;
  totalTasks: number;
}

// Download backup as JSON file
export const downloadBackupApi = async (
  token: string
): Promise<BackupData | null> => {
  try {
    const response = await fetch("/backupData", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to download backup: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error downloading backup", error);
    return null;
  }
};

// Save backup to local file
export const saveBackupToFile = (backupData: any) => {
  try {
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;

    // Create filename with date and time: backup-YYYY-MM-DD_HH-MM-SS.json
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    link.download = `backup-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.json`; // Prevent navigation/reload
    link.style.display = "none";
    link.setAttribute("target", "_self");

    document.body.appendChild(link);

    // Use timeout to ensure browser doesn't navigate
    setTimeout(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }, 0);

    return true;
  } catch (error) {
    console.error("Error saving backup to file", error);
    return false;
  }
};

// Upload backup to Google Drive
export const uploadBackupToGoogleDriveApi = async (
  token: string,
  backupData: BackupData,
  accessToken: string
): Promise<{ success: boolean; fileId?: string; message: string }> => {
  try {
    const response = await fetch("/uploadToGoogleDrive", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        backupData,
        accessToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message || `Failed to upload: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      fileId: data.fileId,
      message: data.message || "Backup uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading backup to Google Drive", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Restore backup from Google Drive
export const restoreBackupFromGoogleDriveApi = async (
  token: string,
  fileId: string,
  accessToken: string
): Promise<{ success: boolean; listsCount?: number; message: string }> => {
  try {
    const response = await fetch("/restoreFromGoogleDrive", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        fileId,
        accessToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message || `Failed to restore: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      listsCount: data.listsCount,
      message: data.message || "Backup restored successfully",
    };
  } catch (error) {
    console.error("Error restoring backup from Google Drive", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Restore backup from local file
export const restoreBackupFromFileApi = async (
  token: string,
  backupData: any
): Promise<{ success: boolean; listsCount?: number; message: string }> => {
  try {
    const response = await fetch("/restoreFromFile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ backupData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message || `Failed to restore: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      listsCount: data.listsCount,
      message: data.message || "Backup restored successfully",
    };
  } catch (error) {
    console.error("Error restoring backup from file", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Get Google OAuth URL for authorization
export const getGoogleOAuthUrl = (): string => {
  const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_DRIVE_REDIRECT_URI;
  const scope = "https://www.googleapis.com/auth/drive.file";

  if (!clientId || !redirectUri) {
    console.warn("Missing Google Drive configuration");
    return "";
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scope,
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Exchange authorization code for access token (backend should handle this)
export const exchangeCodeForTokenApi = async (
  code: string
): Promise<{ success: boolean; accessToken?: string; message: string }> => {
  try {
    const response = await fetch("/google-oauth-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to exchange code: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.accessToken,
      message: "Authorization successful",
    };
  } catch (error) {
    console.error("Error exchanging code for token", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// List backup files from Google Drive
export const listGoogleDriveBackupsApi = async (
  accessToken: string
): Promise<{
  success: boolean;
  files?: Array<{ id: string; name: string; modifiedTime: string }>;
  message: string;
}> => {
  try {
    // First, find the backup folder ID
    const folderResponse = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=name='to-do-list-backup' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!folderResponse.ok) {
      return {
        success: false,
        message: `Failed to find folder: ${folderResponse.statusText}`,
      };
    }

    const folderData = await folderResponse.json();

    // If folder doesn't exist, return empty list
    if (!folderData.files || folderData.files.length === 0) {
      return {
        success: true,
        files: [],
        message: "Backup folder not found",
      };
    }

    const folderId = folderData.files[0].id;

    // List files in the backup folder
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains 'backup-' and mimeType='application/json' and trashed=false&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to list files: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      files: data.files || [],
      message: "Files listed successfully",
    };
  } catch (error) {
    console.error("Error listing Google Drive files", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Delete backup from Google Drive
export const deleteBackupFromGoogleDriveApi = async (
  accessToken: string,
  fileId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    process.env.NODE_ENV === "development" &&
      console.log("[Delete Backup] Starting delete for fileId:", fileId);

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    process.env.NODE_ENV === "development" &&
      console.log("[Delete Backup] Response status:", response.status);

    // 204 No Content is success for DELETE requests
    if (response.status === 204 || response.ok) {
      process.env.NODE_ENV === "development" &&
        console.log("[Delete Backup] File deleted successfully");
      return {
        success: true,
        message: "Backup deleted successfully",
      };
    }

    const errorText = await response.text();
    console.error("[Delete Backup] Error response:", errorText);

    return {
      success: false,
      message: `Failed to delete backup: ${response.statusText}`,
    };
  } catch (error) {
    console.error("Error deleting backup from Google Drive", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete backup",
    };
  }
};
