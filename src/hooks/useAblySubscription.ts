import { useEffect } from "react";
import { useAblyManager } from "./useAblyManager";
import { useQueryClient } from "@tanstack/react-query";
import { setChangeSource } from "../features/tasks/tasksSlice";
import { useAppDispatch } from "./redux";
import { getOrCreateDeviceId } from "../utils/deviceId";

export interface PresenceData {
  users: Array<{ email: string; deviceCount: number }>;
  totalUsers: number;
  userDevices: number;
  allDevices: number;
}

export interface UseAblySyncParams {
  userEmail: string | null;
  enabled: boolean;
  onPresenceUpdate?: (data: PresenceData) => void;
}

/**
 * Hook do obsługi presence updates i lists sync
 * Używa centralnego AblyManager do wszystkich operacji
 */
export const useAblySubscription = ({
  userEmail,
  enabled,
  onPresenceUpdate,
}: UseAblySyncParams) => {
  const {
    onPresenceUpdate: subscribePresence,
    onListsUpdate: subscribeListsUpdate,
  } = useAblyManager();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  // Subscribe do presence updates
  useEffect(() => {
    if (!enabled || !userEmail || !onPresenceUpdate) {
      return;
    }

    const unsubscribe = subscribePresence(onPresenceUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enabled, userEmail, onPresenceUpdate, subscribePresence]);

  // Subscribe do lists updates
  useEffect(() => {
    if (!enabled || !userEmail) {
      return;
    }

    const currentDeviceId = getOrCreateDeviceId();

    const unsubscribe = subscribeListsUpdate(userEmail, (data) => {
      if (data.lists) {
        console.log("id ", data.deviceId, currentDeviceId);
        if (data.deviceId === currentDeviceId) return;

        process.env.NODE_ENV === "development" &&
          console.log(
            "[useAblySubscription] Received lists update via Ably:",
            data
          );

        dispatch(setChangeSource("remote"));
        queryClient.setQueryData(["listsData"], data);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, userEmail, subscribeListsUpdate, queryClient]);
};
