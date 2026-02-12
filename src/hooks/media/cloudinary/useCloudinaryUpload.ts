import { useRef, useState } from "react";
import { UploadResult } from "../../../types";
import { validateImageFile } from "../../../utils/validation/validateImageFile";
import { getCloudinarySignature } from "../../../api/cloudinary/getSignature";
import { uploadImageToCloudinary } from "../../../api/cloudinary/uploadImage";

export const useCloudinaryUpload = () => {
  const abortRef = useRef<AbortController | null>(null);
  const lastProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File): Promise<UploadResult> => {
    setProgress(0);
    validateImageFile(file);

    const config = await getCloudinarySignature();

    const abortController = new AbortController();
    abortRef.current?.abort();
    abortRef.current = abortController;

    const result = await uploadImageToCloudinary(file, config, {
      signal: abortController.signal,
      onProgress: (percent) => {
        const now = Date.now();
        if (percent === 100 || now - lastProgressRef.current >= 150) {
          lastProgressRef.current = now;
          setProgress(percent);
        }
      },
    });

    setProgress(100);
    return result;
  };

  const cancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setProgress(0);
  };

  const resetProgress = () => {
    setProgress(0);
  };

  return { upload, cancel, resetProgress, progress };
};
