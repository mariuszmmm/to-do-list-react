import { UploadError, UploadErrorCode } from "../errors/UploadError";
import { IMAGE_VALIDATION_CONFIG } from "./imageValidationConfig";

export const validateImageFile = (file: File): void => {
  if (!file) {
    throw new UploadError(UploadErrorCode.NO_FILE_SELECTED);
  }

  if (!(IMAGE_VALIDATION_CONFIG.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    throw new UploadError(UploadErrorCode.INVALID_FILE_TYPE);
  }

  if (file.size > IMAGE_VALIDATION_CONFIG.MAX_SIZE) {
    throw new UploadError(UploadErrorCode.FILE_TOO_LARGE);
  }
};
