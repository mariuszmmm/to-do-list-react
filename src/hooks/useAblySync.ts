// import { getOrCreateDeviceId } from "../utils/deviceId";
// import { useEffect, useRef } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import ably from "../utils/ably";
// import type Ably from "ably";
// import { setChangeSource } from "../features/tasks/tasksSlice";
// import { useAppDispatch } from "./redux";

// interface UseAblySyncParams {
//   userEmail: string | null;
//   enabled: boolean;
// }

// export const useAblySync = ({ userEmail, enabled }: UseAblySyncParams) => {
//   const channelRef = useRef<Ably.RealtimeChannel | null>(null);
//   const queryClient = useQueryClient();
//   const dispatch = useAppDispatch();
//   const deviceId = getOrCreateDeviceId();

//   useEffect(() => {
//     if (!enabled || !userEmail) {
//       return;
//     }

//     const channelName = `user:${userEmail}:lists`;
//     const channel = ably.channels.get(channelName);
//     channelRef.current = channel;

//     const messageHandler = (message: Ably.Message) => {
//       const ablyDeviceId = message.data?.deviceId;
//       if (ablyDeviceId && ablyDeviceId === deviceId) return;
//       if (message.data && message.data.lists) {
//         dispatch(setChangeSource("remote"));
//         queryClient.setQueryData(["listsData"], message.data);
//       }
//     };

//     channel.subscribe(messageHandler);

//     return () => {
//       channel.unsubscribe(messageHandler);
//       channelRef.current = null;
//     };

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [enabled, userEmail, queryClient]);

//   return { channel: channelRef.current };
// };

export {};
