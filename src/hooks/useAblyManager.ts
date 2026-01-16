import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "./redux";
import {
  selectIsAdmin,
  selectLoggedUserEmail,
} from "../features/AccountPage/accountSlice";
import {
  getAblyInstance,
  closeAblyConnection,
  safeDetachChannel,
  safePresenceLeave,
  setPendingConfirmationEmail,
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
 * Central hook for managing all Ably subscriptions and channels.
 * Handles real-time updates, presence, and confirmation logic for collaborative features.
 */
export const useAblyManager = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const channelsRef = useRef<Map<string, any>>(new Map());
  const confirmationHandlersRef = useRef<Map<string, (message: any) => void>>(
    new Map()
  );
  const presenceChannelRef = useRef<any | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const isAdmin = useAppSelector(selectIsAdmin);

  const subscribeToConfirmationChannel = useCallback(async (email: string) => {
    if (!email) return;

    const channelKey = `confirmation:${email}`;
    if (channelsRef.current.has(channelKey)) {
      return;
    }

    const ably = getAblyInstance();
    const channel = ably.channels.get(`user:${email}:confirmation`);
    channelsRef.current.set(channelKey, channel);

    const handleConfirmation = (message: any) => {
      if (message.data?.type === "user-confirmed") {
        const callbacks = subscriptionsRef.confirmation.get(email) || [];
        callbacks.forEach((cb) => cb(message.data));
      }
    };

    confirmationHandlersRef.current.set(channelKey, handleConfirmation);

    try {
      await channel.attach();
      channel.subscribe("user-confirmed", handleConfirmation);
    } catch (err) {
      if (err instanceof Error && err.message.includes("superseded")) {
        return;
      }
      console.error("[AblyManager] Confirmation attach failed:", err);
    }
  }, []);

  const cleanupConfirmationChannel = useCallback(async (email: string) => {
    const channelKey = `confirmation:${email}`;
    const channel = channelsRef.current.get(channelKey);
    const handler = confirmationHandlersRef.current.get(channelKey);

    if (channel && handler) {
      channel.unsubscribe("user-confirmed", handler);
    }

    if (channel) {
      await safeDetachChannel(channel, 2000);
    }

    channelsRef.current.delete(channelKey);
    confirmationHandlersRef.current.delete(channelKey);
  }, []);

  const onConfirmation = useCallback(
    async (email: string, callback: ConfirmationCallback) => {
      if (!email) return () => {};

      const callbacks = subscriptionsRef.confirmation.get(email) || [];
      callbacks.push(callback);
      subscriptionsRef.confirmation.set(email, callbacks);

      try {
        await subscribeToConfirmationChannel(email);
      } catch (err) {
        console.error("[AblyManager] Confirmation subscribe error:", err);
      }

      return () => {
        const currentCallbacks = subscriptionsRef.confirmation.get(email) || [];
        const idx = currentCallbacks.indexOf(callback);
        if (idx > -1) currentCallbacks.splice(idx, 1);

        if (currentCallbacks.length === 0) {
          subscriptionsRef.confirmation.delete(email);
          cleanupConfirmationChannel(email).catch((err) =>
            console.error("[AblyManager] Confirmation cleanup error:", err)
          );
        } else {
          subscriptionsRef.confirmation.set(email, currentCallbacks);
        }
      };
    },
    [cleanupConfirmationChannel, subscribeToConfirmationChannel]
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
    const callbacks = subscriptionsRef.presenceUpdate.get("presence") || [];
    callbacks.push(callback);
    subscriptionsRef.presenceUpdate.set("presence", callbacks);

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

    // Initialize data channel for user lists
    const dataChannel = ably.channels.get(`user:${loggedUserEmail}:lists`);
    channelsRef.current.set("data", dataChannel);

    // Initialize presence channels for user and admin
    const presenceSelfChannel = ably.channels.get(
      `user:${loggedUserEmail}:presence`
    );
    const presenceAdminChannel = ably.channels.get("global:presence-admins");

    // Admin uses global presence, user uses own presence channel for counts
    const presenceCountChannel = isAdmin
      ? presenceAdminChannel
      : presenceSelfChannel;

    presenceChannelRef.current = presenceCountChannel;
    channelsRef.current.set("presence:self", presenceSelfChannel);
    channelsRef.current.set("presence:admin", presenceAdminChannel);
    channelsRef.current.set("presence", presenceCountChannel);

    const initializeChannels = async () => {
      try {
        await dataChannel.attach();
        await presenceSelfChannel.attach();
        await presenceAdminChannel.attach();
        await subscribeToConfirmationChannel(loggedUserEmail);
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

      const updatePresenceCount = async () => {
        try {
          if (presenceCountChannel.state !== "attached") {
            return;
          }

          const members = await presenceCountChannel.presence.get();
          const counts = members.reduce<Record<string, number>>((acc, m) => {
            const email = m.data?.email || (m.clientId || "").split(":")[0];
            if (email) acc[email] = (acc[email] || 0) + 1;
            return acc;
          }, {});
          const users = Object.keys(counts)
            .sort((a, b) => a.localeCompare(b))
            .map((email) => ({ email, deviceCount: counts[email] }));
          const totalUsers = users.length;
          const userDevices = counts[loggedUserEmail || ""] || 0;
          const allDevices = members.length;

          const callbacks =
            subscriptionsRef.presenceUpdate.get("presence") || [];
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

      presenceCountChannel.presence.subscribe("enter", handlePresenceEvent);
      presenceCountChannel.presence.subscribe("leave", handlePresenceEvent);
      presenceCountChannel.presence.subscribe("update", handlePresenceEvent);

      try {
        // Always enter own presence channel
        await presenceSelfChannel.presence.enter({
          email: loggedUserEmail,
          deviceId: currentDeviceId,
          status: "available",
        });
        // Also enter global admin channel so admin can see all users
        await presenceAdminChannel.presence.enter({
          email: loggedUserEmail,
          deviceId: currentDeviceId,
          status: "available",
        });
      } catch (err) {
        console.error("[AblyManager] Presence enter failed:", err);
      }

      // Update presence count after entering channels
      await updatePresenceCount();
    };

    initializeChannels();

    const channels = channelsRef.current;
    const confirmationHandlers = confirmationHandlersRef.current;

    return () => {
      isInitializedRef.current = false;

      (async () => {
        try {
          for (const [key, channel] of channels) {
            if (key.startsWith("presence") && channel?.presence) {
              await safePresenceLeave(
                channel.presence,
                { status: "offline" },
                2000
              );
            }

            if (key.startsWith("confirmation:")) {
              const handler = confirmationHandlers.get(key);
              if (handler) {
                channel.unsubscribe("user-confirmed", handler);
              }
            }

            await safeDetachChannel(channel, 2000);
          }
        } catch (err) {
          console.error("[AblyManager] Cleanup error:", err);
        } finally {
          channels.clear();
          confirmationHandlers.clear();
          presenceChannelRef.current = null;
        }
      })();
    };
  }, [loggedUserEmail, isAdmin, subscribeToConfirmationChannel]);

  useEffect(() => {
    if (!loggedUserEmail) {
      // Czekaj chwilę aby cleanup useEffect się wykonał
      const timer = setTimeout(() => {
        closeAblyConnection();
        isInitializedRef.current = false;
        subscriptionsRef.confirmation.clear();
        subscriptionsRef.listsUpdate.clear();
        subscriptionsRef.presenceUpdate.clear();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loggedUserEmail]);

  return {
    onConfirmation,
    onListsUpdate,
    onPresenceUpdate,
    setPendingConfirmationEmail,
  };
};
