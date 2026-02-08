import { useEffect, useRef, useState } from "react";
import { deleteCloudinaryImage, getCloudinarySignature, moveCloudinaryImageToFolder } from "../api/fetchCloudinaryApi";
import { UploadResult } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import axios from "axios";
import { translateText } from "../api/translateTextApi";
import i18n from "../utils/i18n";
import { selectLoggedUserEmail } from "../features/AccountPage/accountSlice";
import { setImage } from "../features/tasks/tasksSlice";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const useTaskImage = (taskImageUrl?: string, taskImagePublicId?: string) => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const lastProgressUpdateRef = useRef(0);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const errorResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useAppDispatch();

  const resetError = () => setErrorMsg(null);

  useEffect(() => {
    if (!taskImageUrl || !taskImagePublicId || !loggedUserEmail) return;
    setImageUrl(taskImageUrl || "");
    setPublicId(taskImagePublicId || "");

    console.log("IMAGE: initialized with:", { taskImageUrl, taskImagePublicId, loggedUserEmail });
  }, [taskImageUrl, taskImagePublicId, loggedUserEmail]);

  useEffect(() => {
    if (!isImageUploading && errorMsg) {
      if (errorResetTimeoutRef.current) {
        clearTimeout(errorResetTimeoutRef.current);
      }
      errorResetTimeoutRef.current = setTimeout(() => {
        setErrorMsg(null);
        errorResetTimeoutRef.current = null;
      }, 5000);
    }

    return () => {
      if (errorResetTimeoutRef.current) {
        clearTimeout(errorResetTimeoutRef.current);
        errorResetTimeoutRef.current = null;
      }
    };
  }, [isImageUploading, errorMsg]);

  const uploadImageToTemp = async (file: File, publicId?: string): Promise<UploadResult | null> => {
    setIsUploadingFile(true);
    setUploadProgress(0);
    setErrorMsg(null);

    try {
      if (!file) {
        console.error("No file selected");
        throw new Error("No file selected");
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        console.error("Unsupported file type:", file.type);
        throw new Error(
          `Unsupported file type.\n Allowed types: ${ALLOWED_TYPES.map((t) => t.replace("image/", "")).join(", ")}`,
        );
      }

      if (file.size > MAX_SIZE) {
        console.error("File size exceeds limit:", file.size);
        throw new Error(`File size exceeds ${MAX_SIZE / (1024 * 1024)} MB`);
      }
      const { apiKey, asset_folder, cloudName, timestamp, signature, uploadPreset } = await getCloudinarySignature();

      if (!apiKey || !cloudName || !signature || !timestamp || !uploadPreset) {
        console.error("Missing Cloudinary configuration");
        throw new Error("Missing Cloudinary configuration");
      }

      const formData = new FormData();
      formData.append("api_key", apiKey);
      formData.append("file", file);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("upload_preset", uploadPreset);
      formData.append("overwrite", "true");
      formData.append("invalidate", "true");
      publicId && formData.append("public_id", publicId);
      formData.append("asset_folder", asset_folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      if (uploadAbortRef.current) {
        setErrorMsg("Another upload is in progress. Canceling it.");
        uploadAbortRef.current.abort();
      }
      const abortController = new AbortController();
      uploadAbortRef.current = abortController;

      const res = await axios.post<UploadResult>(uploadUrl, formData, {
        signal: abortController.signal,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total;
          if (typeof total === "number" && total > 0) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
            const now = Date.now();
            if (percentCompleted === 100 || now - lastProgressUpdateRef.current >= 150) {
              lastProgressUpdateRef.current = now;
              setUploadProgress(percentCompleted);
            }
          }
        },
      });

      setUploadProgress(100);
      setIsUploadingFile(false);
      return res.data;
    } catch (error: unknown) {
      const isCanceled =
        typeof error === "object" &&
        error !== null &&
        ("code" in error || "name" in error) &&
        ((error as { code?: string }).code === "ERR_CANCELED" || (error as { name?: string }).name === "CanceledError");

      if (isCanceled) {
        cancelUpload();
        throw new Error("Image upload canceled");
      }

      console.error("Upload error:", error);
      const msg = error instanceof Error ? error.message : "";
      const translatedText =
        (msg ? await translateText(msg, i18n.language) : null) ||
        i18n.t("taskImagePage.messages.error.imageUploadError");
      setErrorMsg(translatedText);
      return null;
    } finally {
      if (uploadAbortRef.current) {
        uploadAbortRef.current = null;
      }
    }
  };

  const cancelUpload = () => {
    const translatedText = i18n.t("taskImagePage.messages.error.imageUploadCanceled");
    setErrorMsg(translatedText);
    uploadAbortRef.current?.abort();
    setIsUploadingFile(false);
    setIsImageUploading(false);
  };

  const imageUpload = async (file: File, publicId?: string, taskId?: string) => {
    resetError();
    setErrorMsg(null);
    setIsImageUploading(true);

    try {
      if (!file) throw new Error("No file provided for upload");
      if (!publicId)
        console.warn("No publicId provided, a new image will be uploaded instead of replacing an existing one");

      const result = await uploadImageToTemp(file);

      if (!taskId) throw new Error("Missing taskId");
      if (!result) throw new Error("Upload failed");
      if (!result.public_id) throw new Error("No public_id returned from upload");
      if (!loggedUserEmail) throw new Error("No logged user email");

      const moveResult = await moveCloudinaryImageToFolder(result.public_id, loggedUserEmail);

      if (!moveResult.success) {
        removeImage(publicId, taskId).catch((err) => {
          console.error("Failed to clean up image after move failure:", err);
        });

        throw new Error(typeof moveResult.body === "string" ? moveResult.body : JSON.stringify(moveResult.body));
      }

      if (publicId && taskId) {
        const removeResult = await removeImage(publicId, taskId);

        if (!removeResult || removeResult.result === "not found") {
          console.warn("Previous image not found during cleanup, might have been already removed:", publicId);
        }
      }

      dispatch(
        setImage({
          taskId,
          image: {
            imageUrl: moveResult.result.secure_url,
            publicId: moveResult.result.public_id,
            format: moveResult.result.format,
            createdAt: moveResult.result.created_at,
            displayName: moveResult.result.display_name,
            height: moveResult.result.height,
            width: moveResult.result.width,
            originalFilename: result.original_filename,
          },
        }),
      );

      setImageUrl(moveResult.result.secure_url);
      setPublicId(moveResult.result.public_id);
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      const msg = error instanceof Error ? error.message : "";
      const translatedText =
        (msg ? await translateText(msg, i18n.language) : null) ||
        i18n.t("taskImagePage.messages.error.imageDeleteError");
      setErrorMsg(translatedText);
    } finally {
      setIsImageUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (publicId?: string, taskId?: string) => {
    try {
      if (!taskId) throw new Error("Missing taskId");
      if (!publicId) throw new Error("No publicId provided");

      setIsRemoving(true);
      setErrorMsg(null);

      const result = await deleteCloudinaryImage(publicId);
      if (result.result === "not found") {
        console.warn("Image not found on Cloudinary");
      }

      dispatch(setImage({ taskId, image: null }));
      setImageUrl("");
      setPublicId("");
      return result;
    } catch (error: unknown) {
      console.error("Error removing image from Cloudinary:", error);

      const msg = error instanceof Error ? error.message : "";
      const translatedText =
        (msg ? await translateText(msg, i18n.language) : null) ||
        i18n.t("taskImagePage.messages.error.imageDeleteError");
      setErrorMsg(translatedText);
      return null;
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    imageUrl,
    publicId,
    imageUpload,
    removeImage,
    isUploadingFile,
    isImageUploading,
    uploadProgress,
    isRemoving,
    errorMsg,
    setErrorMsg,
    resetError,
    cancelUpload,
  };
};
