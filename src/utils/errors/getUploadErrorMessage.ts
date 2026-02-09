import i18n from "../../utils/i18n";
import { UploadError, UploadErrorCode } from "./UploadError";
import { IMAGE_VALIDATION_CONFIG } from "../validation/imageValidationConfig";

export const getUploadErrorMessage = (error: unknown): string => {
  if (error instanceof UploadError) {
    switch (error.code) {
      case UploadErrorCode.NOT_AUTHENTICATED:
        return i18n.t("taskImagePage.messages.error.notAuthenticated");
      case UploadErrorCode.UPLOAD_INVALID_RESPONSE:
        return i18n.t("taskImagePage.messages.error.uploadInvalidResponse");
      case UploadErrorCode.MOVE_FAILED:
        return i18n.t("taskImagePage.messages.error.moveFailed");
      case UploadErrorCode.NO_FILE_SELECTED:
        return i18n.t("taskImagePage.messages.error.noFileSelected");
      case UploadErrorCode.INVALID_FILE_TYPE:
        return i18n.t("taskImagePage.messages.error.invalidFileType", {
          allowedTypes: IMAGE_VALIDATION_CONFIG.ALLOWED_TYPES.map((t) => t.replace("image/", "").toUpperCase()).join(
            ", ",
          ),
        });
      case UploadErrorCode.FILE_TOO_LARGE:
        return i18n.t("taskImagePage.messages.error.fileTooLarge", {
          maxSize: IMAGE_VALIDATION_CONFIG.MAX_SIZE_MB,
        });
      case UploadErrorCode.UPLOAD_CANCELED:
        return i18n.t("taskImagePage.messages.error.uploadCanceled");
      case UploadErrorCode.CANCELED_AFTER_UPLOAD:
        return i18n.t("taskImagePage.messages.error.canceledAfterUpload");
      case UploadErrorCode.DELETE_FAILED:
        return i18n.t("taskImagePage.messages.error.imageDeleteError");
      case UploadErrorCode.GENERAL_ERROR:
        return i18n.t("taskImagePage.messages.error.imageUploadError");
      default:
        return i18n.t("taskImagePage.messages.error.imageUploadError");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("taskImagePage.messages.error.unknownError");
};
