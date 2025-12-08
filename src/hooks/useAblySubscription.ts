import { useEffect } from "react";
import { useAblyManager } from "./useAblyManager";
import { useQueryClient } from "@tanstack/react-query";

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

    const unsubscribe = subscribeListsUpdate(userEmail, (data) => {
      console.log("[AblySubscription] Lists updated:", data);
      if (data.lists) {
        queryClient.setQueryData(["listsData"], data);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enabled, userEmail, subscribeListsUpdate, queryClient]);
};
