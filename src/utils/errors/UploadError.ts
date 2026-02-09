export enum UploadErrorCode {
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  UPLOAD_INVALID_RESPONSE = "UPLOAD_INVALID_RESPONSE",
  MOVE_FAILED = "MOVE_FAILED",
  NO_FILE_SELECTED = "NO_FILE_SELECTED",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  UPLOAD_CANCELED = "UPLOAD_CANCELED",
  CANCELED_AFTER_UPLOAD = "CANCELED_AFTER_UPLOAD",
  DELETE_FAILED = "DELETE_FAILED",
  GENERAL_ERROR = "GENERAL_ERROR",
}

export class UploadError extends Error {
  constructor(
    public code: UploadErrorCode,
    message?: string,
  ) {
    super(message || code);
    this.name = "UploadError";
  }
}
