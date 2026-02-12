import axios from "axios";
import { UploadResult } from "../../types";

interface CloudinaryConfig {
  api_key: string;
  asset_folder: string;
  cloud_name: string;
  signature: string;
  tags: string;
  timestamp: string;
  upload_preset: string;
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
  const { api_key, asset_folder, cloud_name, signature, tags, timestamp, upload_preset } = config;

  const formData = new FormData();
  formData.append("api_key", api_key);
  formData.append("asset_folder", asset_folder);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("upload_preset", upload_preset);
  formData.append("tags", tags);
  formData.append("file", file);
  formData.append("overwrite", "true");
  formData.append("invalidate", "true");

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

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
