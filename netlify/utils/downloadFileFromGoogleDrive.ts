import { BackupData } from "./../../src/types/data";

export const downloadFileFromGoogleDrive = async (
  fileId: string,
  accessToken: string
): Promise<BackupData> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 401) {
      const error: any = new Error("Google Drive authorization error");
      error.status = 401;
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Failed to download file: ${response.statusText}`
      );
    }

    const data: BackupData = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
