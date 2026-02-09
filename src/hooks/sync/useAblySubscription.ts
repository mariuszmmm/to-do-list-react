import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setChangeSource } from "../../features/tasks/tasksSlice";
import { useAppDispatch } from "../redux/redux";
import { getOrCreateDeviceId } from "../../utils/storage/deviceId";

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
  subscribePresence?: (cb: (data: PresenceData) => void) => void | (() => void);
  subscribeListsUpdate?: (email: string, cb: (data: any) => void) => void | (() => void);
}

export const useAblySubscription = ({
  userEmail,
  enabled,
  onPresenceUpdate,
  subscribePresence,
  subscribeListsUpdate,
}: UseAblySyncParams) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || !userEmail || !onPresenceUpdate || !subscribePresence) {
      return;
    }

    const unsubscribe = subscribePresence(onPresenceUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enabled, userEmail, onPresenceUpdate, subscribePresence]);

  useEffect(() => {
    if (!enabled || !userEmail || !subscribeListsUpdate) {
      return;
    }

    const currentDeviceId = getOrCreateDeviceId();

    const unsubscribe = subscribeListsUpdate(userEmail, (data) => {
      if (data.lists) {
        if (data.deviceId === currentDeviceId) return;

        !["restore"].includes(data.action) && dispatch(setChangeSource("remote"));
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
