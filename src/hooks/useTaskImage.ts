import { useState, useEffect } from "react";
import {
  deleteCloudinaryImage,
  getCloudinarySignature,
} from "../api/fetchCloudinaryApi";
import { UploadResult } from "../types";
import axios from "axios";
import { translateText } from "../utils/translateText";
import i18n from "../utils/i18n";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const useTaskImage = (imageUrl?: string | null) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetError = () => setErrorMsg(null);

  useEffect(() => {
    if (!imageUrl) return;

    let isCancelled = false;
    let currentBlobUrl: string | null = null;

    const loadImage = async (): Promise<void> => {
      try {
        setDownloadProgress(0);
        setIsDownloading(true);

        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Image fetch failed");

        const contentLength = response.headers.get("Content-Length");

        if (!contentLength || !response.body) {
          const blob = await response.blob();
          if (!isCancelled) {
            currentBlobUrl = URL.createObjectURL(blob);
            setImageSrc(currentBlobUrl);
          }
          return;
        }

        const total = parseInt(contentLength, 10);
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!value) continue;

          chunks.push(value);
          loaded += value.byteLength;

          if (!isCancelled) {
            setDownloadProgress(Math.round((loaded / total) * 100));
          }
        }

        const blob = new Blob(chunks as BlobPart[]);
        if (!isCancelled) {
          currentBlobUrl = URL.createObjectURL(blob);
          setImageSrc(currentBlobUrl);
          setDownloadProgress(0);
          setIsDownloading(false);
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "";
        const translatedText =
          (await translateText(msg, i18n.language)) ||
          i18n.t("errorMessage.imageLoadingError");

        if (!isCancelled) {
          setErrorMsg(translatedText);
        }
      } finally {
        if (!isCancelled) {
          setDownloadProgress(0);
          setIsDownloading(false);
        }
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
      setDownloadProgress(0);
      setIsDownloading(false);
    };
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const uploadImage = async (
    file: File,
    publicId?: string,
    folder?: string,
  ): Promise<UploadResult | null> => {
    try {
      if (!file) {
        console.error("No file selected");
        throw new Error("No file selected");
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        console.error("Unsupported file type:", file.type);
        throw new Error(
          `Unsupported file type.\n Allowed types: ${ALLOWED_TYPES.map((t) =>
            t.replace("image/", ""),
          ).join(", ")}`,
        );
      }

      if (file.size > MAX_SIZE) {
        console.error("File size exceeds limit:", file.size);
        throw new Error(`File size exceeds ${MAX_SIZE / (1024 * 1024)} MB`);
      }
      const { timestamp, signature, cloudName, apiKey, uploadPreset } =
        await getCloudinarySignature(publicId, folder);

      if (!timestamp || !signature || !cloudName || !apiKey || !uploadPreset) {
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
      folder && formData.append("asset_folder", folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      setIsUploading(true);
      setUploadProgress(0);
      setErrorMsg(null);

      const res = await axios.post<UploadResult>(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          setUploadProgress(percentCompleted);
        },
      });

      return res.data;
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const msg = error instanceof Error ? error.message : "";
      const translatedText =
        (await translateText(msg, i18n.language)) ||
        i18n.t("errorMessage.imageUploadError");
      setErrorMsg(translatedText);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (publicId: string) => {
    try {
      if (!publicId) throw new Error("No publicId provided");

      setIsRemoving(true);
      setErrorMsg(null);

      const result = await deleteCloudinaryImage(publicId);
      setImageSrc("");
      if (result.result === "not found") {
        console.warn("Image not found on Cloudinary");
      }

      return result;
    } catch (error: unknown) {
      console.error("Error removing image from Cloudinary:", error);

      const msg = error instanceof Error ? error.message : "";
      const translatedText =
        (await translateText(msg, i18n.language)) ||
        i18n.t("errorMessage.imageDeleteError");
      setErrorMsg(translatedText);
      return null;
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    uploadImage,
    removeImage,
    isUploading,
    uploadProgress,
    downloadProgress,
    isDownloading,
    isRemoving,
    imageSrc,
    errorMsg,
    resetError,
  };
};
