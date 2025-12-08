import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "./redux";
import { selectLoggedUserEmail } from "../features/AccountPage/accountSlice";
import {
  getAblyInstance,
  closeAblyConnection,
  safeDetachChannel,
  safePresenceLeave,
} from "../utils/ably";
import { getOrCreateDeviceId } from "../utils/deviceId";

// Callback types
type ConfirmationCallback = (data: { type: string; email: string }) => void;
type ListsUpdateCallback = (data: any) => void;
type PresenceUpdateCallback = (data: {
  users: Array<{ email: string; deviceCount: number }>;
  totalUsers: number;
  userDevices: number;
  allDevices: number;
}) => void;

// Global subscriptions management
const subscriptionsRef = {
  confirmation: new Map<string, ConfirmationCallback[]>(),
  listsUpdate: new Map<string, ListsUpdateCallback[]>(),
  presenceUpdate: new Map<string, PresenceUpdateCallback[]>(),
};

/**
 * Centralny hook do zarządzania wszystkimi subskrypcjami Ably
 * Zagwarantuje, że logika Ably jest w jednym miejscu
 */
export const useAblyManager = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const channelsRef = useRef<Map<string, any>>(new Map());
  const presenceChannelRef = useRef<any | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const onConfirmation = useCallback(
    (email: string, callback: ConfirmationCallback) => {
      const callbacks = subscriptionsRef.confirmation.get(email) || [];
      callbacks.push(callback);
      subscriptionsRef.confirmation.set(email, callbacks);

      return () => {
        const idx = callbacks.indexOf(callback);
        if (idx > -1) callbacks.splice(idx, 1);
      };
    },
    []
  );

  const onListsUpdate = useCallback(
    (email: string, callback: ListsUpdateCallback) => {
      const callbacks = subscriptionsRef.listsUpdate.get(email) || [];
      callbacks.push(callback);
      subscriptionsRef.listsUpdate.set(email, callbacks);

      return () => {
        const idx = callbacks.indexOf(callback);
        if (idx > -1) callbacks.splice(idx, 1);
      };
    },
    []
  );

  const onPresenceUpdate = useCallback((callback: PresenceUpdateCallback) => {
    const callbacks = subscriptionsRef.presenceUpdate.get("global") || [];
    callbacks.push(callback);
    subscriptionsRef.presenceUpdate.set("global", callbacks);

    return () => {
      const idx = callbacks.indexOf(callback);
      if (idx > -1) callbacks.splice(idx, 1);
    };
  }, []);

  useEffect(() => {
    if (!loggedUserEmail) {
      return;
    }

    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    const ably = getAblyInstance();
    const currentDeviceId = getOrCreateDeviceId();

    // Initialize data channel
    const dataChannel = ably.channels.get(`user:${loggedUserEmail}:lists`);
    channelsRef.current.set("data", dataChannel);

    // Initialize confirmation channel
    const confirmationChannel = ably.channels.get(
      `user:${loggedUserEmail}:confirmation`
    );
    channelsRef.current.set("confirmation", confirmationChannel);

    // Initialize presence channel
    const presenceChannel = ably.channels.get("global:presence");
    presenceChannelRef.current = presenceChannel;
    channelsRef.current.set("presence", presenceChannel);

    const initializeChannels = async () => {
      try {
        await dataChannel.attach();
        await presenceChannel.attach();
        await confirmationChannel.attach();
      } catch (err) {
        if (err instanceof Error && err.message.includes("superseded")) {
          return;
        }
        console.error("[AblyManager] Channel attach failed:", err);
        return;
      }

      const handleListsMessage = (message: any) => {
        if (!message.data?.lists) return;
        if (message.data.deviceId === currentDeviceId) return;
        const callbacks =
          subscriptionsRef.listsUpdate.get(loggedUserEmail) || [];
        callbacks.forEach((cb) => cb(message.data));
      };

      dataChannel.subscribe("lists-updated", handleListsMessage);

      const handleConfirmation = (message: any) => {
        if (message.data?.type === "user-confirmed") {
          const email = message.data.email;
          const callbacks = subscriptionsRef.confirmation.get(email) || [];
          callbacks.forEach((cb) => cb(message.data));
        }
      };

      confirmationChannel.subscribe("user-confirmed", handleConfirmation);

      const updatePresenceCount = async () => {
        try {
          if (presenceChannel.state !== "attached") {
            return;
          }

          const members = await presenceChannel.presence.get();
          const counts = members.reduce<Record<string, number>>((acc, m) => {
            const email = (m.clientId || "").split(":")[0];
            if (email) acc[email] = (acc[email] || 0) + 1;
            return acc;
          }, {});
          const users = Object.keys(counts)
            .sort((a, b) => a.localeCompare(b))
            .map((email) => ({ email, deviceCount: counts[email] }));
          const totalUsers = users.length;
          const userDevices = counts[loggedUserEmail || ""] || 0;
          const allDevices = members.length;

          const callbacks = subscriptionsRef.presenceUpdate.get("global") || [];
          callbacks.forEach((cb) =>
            cb({
              users,
              totalUsers,
              userDevices,
              allDevices,
            })
          );
        } catch (err) {
          if (err instanceof Error && err.message.includes("detached")) {
            return;
          }
          console.error("[AblyManager] Presence count error:", err);
        }
      };

      const handlePresenceEvent = async () => {
        await updatePresenceCount();
      };

      presenceChannel.presence.subscribe("enter", handlePresenceEvent);
      presenceChannel.presence.subscribe("leave", handlePresenceEvent);
      presenceChannel.presence.subscribe("update", handlePresenceEvent);

      await updatePresenceCount();

      try {
        await presenceChannel.presence.enter({
          email: loggedUserEmail,
          deviceId: currentDeviceId,
          status: "available",
        });
      } catch (err) {
        console.error("[AblyManager] Presence enter failed:", err);
      }
    };

    initializeChannels();

    const channels = channelsRef.current;

    return () => {
      isInitializedRef.current = false;

      (async () => {
        try {
          const presenceChannel = channels.get("presence");
          const confirmationChannel = channels.get("confirmation");
          const dataChannelCleanup = channels.get("data");

          if (presenceChannel) {
            await safePresenceLeave(
              presenceChannel.presence,
              { status: "offline" },
              2000
            );
            await safeDetachChannel(presenceChannel, 2000);
          }

          if (confirmationChannel) {
            await safeDetachChannel(confirmationChannel, 2000);
          }

          if (dataChannelCleanup) {
            await safeDetachChannel(dataChannelCleanup, 2000);
          }
        } catch (err) {
          console.error("[AblyManager] Cleanup error:", err);
        }
      })();

      channels.clear();
      presenceChannelRef.current = null;
    };
  }, [loggedUserEmail]);

  useEffect(() => {
    if (!loggedUserEmail) {
      closeAblyConnection();
      isInitializedRef.current = false;
      subscriptionsRef.confirmation.clear();
      subscriptionsRef.listsUpdate.clear();
      subscriptionsRef.presenceUpdate.clear();
    }
  }, [loggedUserEmail]);

  return {
    onConfirmation,
    onListsUpdate,
    onPresenceUpdate,
  };
};
