import { useEffect, useRef } from "react";
import { getOrCreateDeviceId } from "../utils/deviceId";
import { getAblyInstance, closeAblyConnection } from "../utils/ably";
import { useQueryClient } from "@tanstack/react-query";
import { ListsData, PresenceUser } from "../types";
import { setChangeSource } from "../features/tasks/tasksSlice";
import { useAppDispatch } from "./redux";

interface PresenceData {
  users: PresenceUser[];
  totalUsers: number;
  userDevices: number;
  allDevices: number;
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
    const dataChannel = ably.channels.get(`user:${userEmail}:lists`);
    const presenceChannel = ably.channels.get("global:presence");
    const currentDeviceId = getOrCreateDeviceId();

    let isCleanedUp = false;

    const updatePresenceCount = async () => {
      try {
        const members = await presenceChannel.presence.get();
        const counts = members.reduce<Record<string, number>>((acc, m) => {
          const email = (m.clientId || "").split(":")[0];
          if (email) acc[email] = (acc[email] || 0) + 1;
          return acc;
        }, {});
        const users: PresenceUser[] = Object.keys(counts)
          .sort((a, b) => a.localeCompare(b))
          .map((email) => ({ email, deviceCount: counts[email] }));
        const totalUsers = users.length;
        const userDevices = counts[userEmail || ""] || 0;
        const allDevices = members.length;

        callbackRef.current?.({
          users,
          totalUsers,
          userDevices,
          allDevices,
        });
      } catch (err) {
        console.error("[Presence] Error getting members:", err);
      }
    };

    const handlePresenceEvent = async () => {
      await updatePresenceCount();
    };

    const handleMessage = (message: any) => {
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

    const initializeChannel = async () => {
      try {
        await dataChannel.attach();
        if (isCleanedUp) return;

        await presenceChannel.attach();
        if (isCleanedUp) return;
      } catch (err) {
        console.error("[Channel] Attach failed:", err);
        return;
      }

      try {
        dataChannel.subscribe("lists-updated", handleMessage);

        if (isCleanedUp) return;

        presenceChannel.presence.subscribe("enter", handlePresenceEvent);
        presenceChannel.presence.subscribe("leave", handlePresenceEvent);
        presenceChannel.presence.subscribe("update", handlePresenceEvent);
        await updatePresenceCount();
        if (isCleanedUp) return;
        await presenceChannel.presence.enter({
          email: userEmail,
          deviceId: currentDeviceId,
          status: "available",
        });
      } catch (err) {
        console.error("[Presence] Error during initialization:", err);
      }
    };

    initializeChannel();

    return () => {
      isCleanedUp = true;

      presenceChannel.presence.unsubscribe("enter", handlePresenceEvent);
      presenceChannel.presence.unsubscribe("leave", handlePresenceEvent);
      presenceChannel.presence.unsubscribe("update", handlePresenceEvent);
      dataChannel.unsubscribe("lists-updated", handleMessage);

      callbackRef.current?.({
        users: [],
        totalUsers: 0,
        userDevices: 0,
        allDevices: 0,
      });

      Promise.all([
        presenceChannel.presence.leave({ status: "offline" }),
        presenceChannel.detach(),
        dataChannel.detach(),
      ])
        .catch((err) => {
          console.error("[Cleanup] Error:", err);
        })
        .finally(() => {
          if (!userEmail) {
            closeAblyConnection();
          }
        });
    };
  }, [userEmail, queryClient, enabled, dispatch, deviceId]);
};
