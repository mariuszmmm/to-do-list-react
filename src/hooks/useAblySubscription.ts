// src/hooks/useAblySubscription.ts
import { useEffect } from "react";
import { useSaveListMutation } from "./useSaveListMutation";
import { getOrCreateDeviceId } from "../utils/deviceId";
import ably from "../utils/ably";
import { useQueryClient } from "@tanstack/react-query";
import { ListsData } from "../types";

export const useAblySubscription = (userEmail: string | null) => {
  const saveListMutation = useSaveListMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userEmail) return;

    const channel = ably.channels.get(`user:${userEmail}:lists`);
    const currentDeviceId = getOrCreateDeviceId();

    const handleMessage = (message: any) => {
      console.log("Received Ably update:", message.data);

      // Ignoruj aktualizacje z tego samego urządzenia
      if (message.data.deviceId === currentDeviceId) {
        console.log("Ignoring own update");
        return;
      }

      // Zaktualizuj lokalny stan z danymi z innego urządzenia
      if (message.data.lists) {
        // Tutaj możesz zaktualizować React Query cache
        // lub wywołać refetch danych
        // Zaktualizuj React Query cache
        queryClient.setQueryData<ListsData>(["lists"], (oldData) => {
          if (!oldData) return oldData;

          console.log(
            "Updating lists from another device:",
            message.data.lists
          );

          // Możesz też obsłużyć usunięte zadania
          if (message.data.deletedTasksIds) {
            console.log("Tasks deleted:", message.data.deletedTasksIds);
          }
          return {
            ...oldData,
            lists: message.data.lists,
          };
        });
        console.log("Updated lists from another device");
      }
    };

    channel.subscribe("lists-updated", handleMessage);

    console.log("Subscribed to Ably channel:", `user:${userEmail}:lists`);

    return () => {
      channel.unsubscribe("lists-updated", handleMessage);
      console.log("Unsubscribed from Ably channel");
    };
  }, [userEmail, queryClient]);
};
