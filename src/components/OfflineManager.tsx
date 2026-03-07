import { useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks";
import { closeModal, openModal } from "../Modal/modalSlice";
import { useOnlineStatus } from "../hooks";

interface OfflineManagerProps {
  refetch: () => void;
}

export const OfflineManager = ({ refetch }: OfflineManagerProps) => {
  const dispatch = useAppDispatch();
  const isOnline = useOnlineStatus();
  const wasOfflineRef = useRef(!navigator.onLine);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      dispatch(
        openModal({
          title: { key: "modal.offline.title" },
          message: { key: "modal.offline.message" },
          type: "info",
        }),
      );
    } else if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      dispatch(closeModal());
      refetch();
    }
  }, [isOnline, dispatch, refetch]);

  return null;
};
