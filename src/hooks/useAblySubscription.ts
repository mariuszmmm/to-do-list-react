import { useEffect } from "react";
import { getOrCreateDeviceId } from "../utils/deviceId";
import ably from "../utils/ably";
import { useQueryClient } from "@tanstack/react-query";
import { ListsData } from "../types";
import { setChangeSource } from "../features/tasks/tasksSlice";
import { useAppDispatch } from "./redux";

interface UseAblySyncParams {
  userEmail: string | null;
  enabled: boolean;
}

export const useAblySubscription = ({
  userEmail,
  enabled,
}: UseAblySyncParams) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const deviceId = getOrCreateDeviceId();

  useEffect(() => {
    if (!enabled || !userEmail) return;

    const channel = ably.channels.get(`user:${userEmail}:lists`);
    const currentDeviceId = getOrCreateDeviceId();

    const handleMessage = (message: any) => {
      console.log("[useAblySubscription] Received Ably update:", message.data);

      if (!message.data) return;
      if (message.data.deviceId === currentDeviceId) return;
      const ablyDeviceId = message.data?.deviceId;
      if (ablyDeviceId && ablyDeviceId === deviceId) return;
      if (message.data.lists) {
        dispatch(setChangeSource("remote"));
        queryClient.setQueryData<ListsData>(["listsData"], (oldData) => {
          if (!oldData) return message.data;

          return {
            ...oldData,
            ...message.data,
            lists: message.data.lists || oldData.lists,
          };
        });
      }
    };

    channel.subscribe("lists-updated", handleMessage);
    console.log(
      "[useAblySubscription] Subscribed to Ably channel:",
      `user:${userEmail}:lists`
    );

    return () => {
      channel.unsubscribe("lists-updated", handleMessage);
      console.log("[useAblySubscription] Unsubscribed from Ably channel");
    };
  }, [userEmail, queryClient, enabled, dispatch, deviceId]);
};
