import { useAppDispatch } from "../../../hooks/redux";
import { AccountState } from "../../../types";
import {
  setAccountMode,
  setIsWaitingForConfirmation,
  setMessage,
  setLoggedUser,
} from "../accountSlice";
import { useRef } from "react";
import Ably from "ably";
import { getOrCreateDeviceId } from "../../../utils/deviceId";
import { auth } from "../../../api/auth";
import { openModal } from "../../../Modal/modalSlice";

interface WaitingForConfirmationProps {
  email?: string;
  password?: string;
  message?: AccountState["message"];
}

export const useWaitingForConfirmation = ({
  email,
  password,
  message,
}: WaitingForConfirmationProps) => {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any | null>(null);

  const waitingForConfirmation = () => {
    if (!email || !password) return;

    try {
      const deviceId = getOrCreateDeviceId();
      const ably = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const response = await fetch(
              `/ably-auth?email=${email}&deviceId=${deviceId}`,
              { method: "GET" }
            );

            if (!response.ok) {
              const errorData = await response.json();
              callback(errorData.message || response.statusText, null);
              return;
            }

            const ablyTokenRequest = await response.json();
            callback(null, ablyTokenRequest);
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : String(err);
            callback(errorMessage, null);
          }
        },
      });

      const channel = ably.channels.get(`user:${email}:confirmation`);
      channelRef.current = channel;

      const handleConfirmation = async (message: any) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (message) dispatch(setMessage(""));
        dispatch(setIsWaitingForConfirmation(false));

        try {
          const response = await auth.login(email, password, true);

          process.env.NODE_ENV === "development" &&
            process.env.NODE_ENV === "development" &&
            console.log("Login successful:", response);

          dispatch(setAccountMode("logged"));
          dispatch(
            setLoggedUser({
              email: response.email,
              name: response.user_metadata.full_name,
              roles: response.app_metadata.roles,
            })
          );

          dispatch(
            openModal({
              title: { key: "modal.login.title" },
              message: {
                key: "modal.login.message.success",
                values: { user: response.email },
              },
              type: "success",
            })
          );
        } catch (err) {
          dispatch(setAccountMode("login"));
          dispatch(setMessage("Login failed after confirmation"));
        }

        channel.unsubscribe("user-confirmed", handleConfirmation);
        await channel.detach();
        channelRef.current = null;
      };

      channel.subscribe("user-confirmed", handleConfirmation);

      timeoutRef.current = setTimeout(async () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe("user-confirmed", handleConfirmation);
          await channelRef.current.detach();
          channelRef.current = null;
        }
        dispatch(setAccountMode("login"));
        if (message) dispatch(setMessage(""));
        dispatch(setIsWaitingForConfirmation(false));
      }, 600000);
    } catch (error) {
      dispatch(setIsWaitingForConfirmation(false));
    }

    return async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (channelRef.current) {
        await channelRef.current.detach();
        channelRef.current = null;
      }
    };
  };

  return { waitingForConfirmation };
};
