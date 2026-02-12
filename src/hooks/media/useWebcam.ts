import { useRef, useState, useCallback, useEffect } from "react";

export interface WebcamError {
  type: "permission-denied" | "camera-not-found" | "unknown";
  message: string;
}

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCameraStartingRef = useRef(false);

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<WebcamError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    if (isCameraStartingRef.current || streamRef.current) return;

    isCameraStartingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const constraints = {
        video: {
          facingMode: "environment",
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Auto-play failed", playErr);
        }
      }

      setIsActive(true);
      setIsAvailable(true);
    } catch (err) {
      const error = err as DOMException;

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setError({
          type: "permission-denied",
          message: error.message,
        });
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setError({
          type: "camera-not-found",
          message: error.message,
        });
      } else {
        setError({
          type: "unknown",
          message: error.message || "An unknown error occurred",
        });
      }

      setIsActive(false);
    } finally {
      setIsLoading(false);
      isCameraStartingRef.current = false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
  }, []);

  const capturePhoto = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current) {
      setError({
        type: "unknown",
        message: "Camera is not ready",
      });
      return null;
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      setError({
        type: "unknown",
        message: "Camera frame not ready",
      });
      return null;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      ctx.drawImage(videoRef.current, 0, 0);

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9,
        );
      });
    } catch (err) {
      const error = err as Error;
      setError({
        type: "unknown",
        message: error.message || "Failed to capture photo",
      });
      return null;
    }
  }, []);

  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);

        if (!hasUserMedia) {
          setIsAvailable(false);
          setError({
            type: "unknown",
            message: "Your browser does not support camera access",
          });
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some((device) => device.kind === "videoinput");

        if (hasVideoDevice) {
          setIsAvailable(true);
          setError(null);
        } else {
          setIsAvailable(false);
        }
      } catch (err) {
        console.error("Failed to check camera availability", err);
        setIsAvailable(false);
      }
    };

    checkCameraAvailability();
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isAvailable,
    isActive,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
  };
};
