import axios from "axios";
import { UploadResult } from "../../types";

interface CloudinaryConfig {
  apiKey: string;
  asset_folder: string;
  cloudName: string;
  signature: string;
  timestamp: string;
  uploadPreset: string;
  context?: string;
}

interface UploadOptions {
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
}

export const uploadImageToCloudinary = async (
  file: File,
  config: CloudinaryConfig,
  options?: UploadOptions,
): Promise<UploadResult> => {
  const { apiKey, asset_folder, cloudName, signature, timestamp, uploadPreset, context } = config;

  const formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("asset_folder", asset_folder);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("upload_preset", uploadPreset);
  formData.append("file", file);
  formData.append("overwrite", "true");
  formData.append("invalidate", "true");

  // Dodaj context (metadata) jeśli jest dostępny
  if (context) {
    formData.append("context", context);
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const res = await axios.post<UploadResult>(uploadUrl, formData, {
    signal: options?.signal,
    onUploadProgress: (progressEvent) => {
      if (options?.onProgress) {
        const total = progressEvent.total;
        if (typeof total === "number" && total > 0) {
          const percent = Math.round((progressEvent.loaded * 100) / total);
          options.onProgress(percent);
        }
      }
    },
  });

  return res.data;
};
