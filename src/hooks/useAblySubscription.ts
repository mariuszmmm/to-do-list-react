import { useEffect, useRef } from "react";
import { getOrCreateDeviceId } from "../utils/deviceId";
import { getAblyInstance, closeAblyConnection } from "../utils/ably";
import { useQueryClient } from "@tanstack/react-query";
import { ListsData } from "../types";
import { setChangeSource } from "../features/tasks/tasksSlice";
import { useAppDispatch } from "./redux";

interface UseAblySyncParams {
  userEmail: string | null;
  enabled: boolean;
  onPresenceUpdate?: (count: number) => void;
}

export const useAblySubscription = ({
  userEmail,
  enabled,
  onPresenceUpdate,
}: UseAblySyncParams) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const deviceId = getOrCreateDeviceId();

  // Stabilna referencja do callback
  const callbackRef = useRef(onPresenceUpdate);

  useEffect(() => {
    callbackRef.current = onPresenceUpdate;
  }, [onPresenceUpdate]);

  useEffect(() => {
    if (!enabled || !userEmail) {
      closeAblyConnection();
      return;
    }

    const ably = getAblyInstance();
    const channel = ably.channels.get(`user:${userEmail}:lists`);
    const currentDeviceId = getOrCreateDeviceId();

    let isCleanedUp = false;

    // Funkcja do aktualizacji liczby użytkowników
    const updatePresenceCount = async () => {
      try {
        const members = await channel.presence.get();
        const count = members.length;
        console.log(`[Presence] Current count: ${count}`);
        callbackRef.current?.(count);
      } catch (err) {
        console.error("[Presence] Error getting members:", err);
      }
    };

    // Subskrypcja na zmiany presence
    const handlePresenceUpdate = (presenceMember: any) => {
      console.log(
        `[Presence] ${presenceMember.clientId} is now ${presenceMember.action}`
      );
      updatePresenceCount();
    };

    // Inicjalizacja kanału
    const initializeChannel = async () => {
      try {
        await channel.attach();

        if (!isCleanedUp) {
          // Subskrybuj PRZED enter
          channel.presence.subscribe(handlePresenceUpdate);

          // Pobierz początkową liczbę
          await updatePresenceCount();

          // Enter tylko RAZ
          await channel.presence.enter({ status: "available" });
          console.log("[Presence] Entered successfully");
        }
      } catch (err) {
        console.error("[Presence] Error during initialization:", err);
      }
    };

    initializeChannel();

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

    // CLEANUP
    return () => {
      isCleanedUp = true;

      // Natychmiast zaktualizuj UI
      callbackRef.current?.(0);
      console.log("[Presence] Optimistically set count to 0");

      // Następnie standardowy cleanup
      channel.presence.unsubscribe(handlePresenceUpdate);
      channel.unsubscribe("lists-updated", handleMessage);

      channel.presence.leave({ status: "offline" }).catch((err) => {
        if (!err.message?.includes("detached")) {
          console.error("[Presence] Error leaving:", err);
        }
      });

      channel.detach().catch(() => {});

      if (!userEmail) {
        closeAblyConnection();
      }

      console.log("[useAblySubscription] Cleanup completed");
    };
  }, [userEmail, queryClient, enabled, dispatch, deviceId]);
};
