import { useEffect, useRef } from "react";
import { getOrCreateDeviceId } from "../utils/deviceId";
import { getAblyInstance, closeAblyConnection } from "../utils/ably";
import { useQueryClient } from "@tanstack/react-query";
import { ListsData, PresenceUser } from "../types";
import { setChangeSource } from "../features/tasks/tasksSlice";
import { useAppDispatch } from "./redux";

interface PresenceData {
  users: PresenceUser[]; // Lista dla komponentu z listą
  totalUsers: number; // Liczba użytkowników dla prostego wyświetlania
  userDevices: number; // Liczba urządzeń aktualnego użytkownika
}

interface UseAblySyncParams {
  userEmail: string | null;
  enabled: boolean;
  onPresenceUpdate?: (data: PresenceData) => void;
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

    // Kanał osobisty dla synchronizacji danych
    const dataChannel = ably.channels.get(`user:${userEmail}:lists`);

    // Kanał globalny dla presence wszystkich użytkowników
    const presenceChannel = ably.channels.get("global:presence");

    const currentDeviceId = getOrCreateDeviceId();

    let isCleanedUp = false;

    // Funkcja do aktualizacji liczby użytkowników
    const updatePresenceCount = async () => {
      try {
        const members = await presenceChannel.presence.get();

        // Grupuj urządzenia po emailach
        const emailDeviceMap = new Map<string, number>();

        members.forEach((member) => {
          const clientId = member.clientId || "";
          const email = clientId.split(":")[0];

          if (email) {
            emailDeviceMap.set(email, (emailDeviceMap.get(email) || 0) + 1);
          }
        });

        // Konwertuj do tablicy obiektów
        const users: PresenceUser[] = Array.from(emailDeviceMap.entries()).map(
          ([email, deviceCount]) => ({
            email,
            deviceCount,
          })
        );

        // Sortuj alfabetycznie po emailu
        users.sort((a, b) => a.email.localeCompare(b.email));

        // Oblicz liczby dla prostego wyświetlania
        const totalUsers = users.length;
        const userDevices = emailDeviceMap.get(userEmail || "") || 0;

        console.log(
          `[Presence] Total users: ${totalUsers}, User devices: ${userDevices}`
        );
        console.log(`[Presence] Users:`, users);

        callbackRef.current?.({
          users,
          totalUsers,
          userDevices,
        });
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
        // Attach do obu kanałów
        await dataChannel.attach();
        await presenceChannel.attach();

        if (!isCleanedUp) {
          // Subskrypcja presence na kanale globalnym
          presenceChannel.presence.subscribe(handlePresenceUpdate);

          // Pobierz początkową liczbę
          await updatePresenceCount();

          // Enter do globalnego presence
          await presenceChannel.presence.enter({
            email: userEmail,
            deviceId: currentDeviceId,
            status: "available",
          });

          console.log("[Presence] Entered global presence");
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

    dataChannel.subscribe("lists-updated", handleMessage);
    console.log(
      "[useAblySubscription] Subscribed to data channel:",
      `user:${userEmail}:lists`
    );

    // CLEANUP
    return () => {
      isCleanedUp = true;

      // Natychmiast zaktualizuj UI
      callbackRef.current?.({
        users: [],
        totalUsers: 0,
        userDevices: 0,
      });
      console.log("[Presence] Optimistically cleared presence data");
      console.log("[Presence] Optimistically set counts to 0");

      // Cleanup presence
      presenceChannel.presence.unsubscribe(handlePresenceUpdate);
      presenceChannel.presence.leave({ status: "offline" }).catch((err) => {
        if (!err.message?.includes("detached")) {
          console.error("[Presence] Error leaving presence:", err);
        }
      });
      presenceChannel.detach().catch(() => {});

      // Cleanup data channel
      dataChannel.unsubscribe("lists-updated", handleMessage);
      dataChannel.detach().catch(() => {});

      if (!userEmail) {
        closeAblyConnection();
      }

      console.log("[useAblySubscription] Cleanup completed");
    };
  }, [userEmail, queryClient, enabled, dispatch, deviceId]);
};
