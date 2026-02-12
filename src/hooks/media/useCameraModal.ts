import { useEffect } from "react";

interface UseCameraModalParams {
  isModalOpen: boolean;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCameraModal = ({ isModalOpen, isActive, startCamera, stopCamera }: UseCameraModalParams) => {
  // Auto-start camera when modal opens
  useEffect(() => {
    if (isModalOpen && !isActive) {
      startCamera();
    }
  }, [isModalOpen, isActive, startCamera]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive, stopCamera]);
};
