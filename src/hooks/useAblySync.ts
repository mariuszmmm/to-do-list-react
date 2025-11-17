import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ably from "../utils/ably";
import { ListsData } from "../types";

interface UseAblySyncParams {
  userEmail: string | null;
  enabled: boolean;
}

export const useAblySync = ({ userEmail, enabled }: UseAblySyncParams) => {
  const channelRef = useRef<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userEmail) {
      return;
    }

    const channelName = `user:${userEmail}:lists`;
    const channel = ably.channels.get(channelName);
    channelRef.current = channel;

    const messageHandler = (message: any) => {
      console.log("✅ Ably message received:", message);

      if (message.data && message.data.lists) {
        const newData: ListsData = {
          email: message.data.email,
          lists: message.data.lists,
        };

        console.log("📦 Updating cache with data from Ably", newData);
        queryClient.setQueryData(["lists"], newData);
      }
    };

    channel.subscribe(messageHandler);
    console.log(`🔌 Subscribed to Ably channel: ${channelName}`);

    return () => {
      console.log(`🔌 Unsubscribing from Ably channel: ${channelName}`);
      channel.unsubscribe(messageHandler);
      channelRef.current = null;
    };
  }, [enabled, userEmail, queryClient]);

  return { channel: channelRef.current };
};
