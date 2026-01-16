import { findOrCreateFolder } from "./findOrCreateFolder";

export const uploadBackupToGoogleDrive = async (
  fileName: string,
  fileContent: string,
  accessToken: string
): Promise<{
  success: boolean;
  statusCode: number;
  fileId?: string;
  fileName?: string;
  message: string;
}> => {
  try {
    const folderId = await findOrCreateFolder("to-do-list-backup", accessToken);

    const fileMetadata: any = {
      name: fileName,
      mimeType: "application/json",
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const boundary = "===============7330845974216740156==";
    const multipartBody =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(fileMetadata) +
      `\r\n--${boundary}\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      fileContent +
      `\r\n--${boundary}--`;

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary="${boundary}"`,
        },
        body: multipartBody,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "[uploadBackupToGoogleDrive] Upload error data:",
        errorData
      );
      return {
        success: false,
        statusCode: response.status,
        message: errorData.error?.message || "Failed to upload file",
      };
    }

    const data = await response.json();
    return {
      success: true,
      statusCode: 200,
      fileId: data.id,
      fileName: data.name,
      message: "File uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading file to Google Drive", error);
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
