import { getOrCreateDeviceId } from "../utils/deviceId";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ably from "../utils/ably";
import type Ably from "ably";
import { setChangeSource } from "../features/tasks/tasksSlice";
import { useAppDispatch } from "./redux";

interface UseAblySyncParams {
  userEmail: string | null;
  enabled: boolean;
}

export const useAblySync = ({ userEmail, enabled }: UseAblySyncParams) => {
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const deviceId = getOrCreateDeviceId();

  useEffect(() => {
    console.log("useAblySync effect called", { enabled, userEmail });
    if (!enabled || !userEmail) {
      console.log("Ably sync disabled or no userEmail");
      return;
    }

    // Wywołanie funkcji serwerless logującej liczbę użytkowników
    fetch("/.netlify/functions/logActiveUsers")
      .then((res) => {
        console.log("logActiveUsers response status:", res.status);
        return res.text();
      })
      .then((text) => {
        console.log("logActiveUsers response body:", text);
      })
      .catch((err) => {
        console.error("logActiveUsers fetch error:", err);
      });

    const channelName = `user:${userEmail}:lists`;
    console.log("Ably channel name:", channelName);
    const channel = ably.channels.get(channelName);
    channelRef.current = channel;
    console.log("Ably channel object:", channel);

    const messageHandler = (message: Ably.Message) => {
      console.log("Ably message received:", message);
      const ablyDeviceId = message.data?.deviceId;
      if (ablyDeviceId && ablyDeviceId === deviceId) {
        console.log("Message from own device, ignored");
        return;
      }
      if (message.data && message.data.lists) {
        dispatch(setChangeSource("remote"));
        queryClient.setQueryData(["lists"], message.data);
        console.log("Ably message updated lists:", message.data);
      }
    };

    channel.subscribe(messageHandler);
    console.log("Subscribed to Ably channel");

    return () => {
      channel.unsubscribe(messageHandler);
      channelRef.current = null;
      console.log("Unsubscribed from Ably channel and cleared ref");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, userEmail, queryClient]);

  return { channel: channelRef.current };
};
