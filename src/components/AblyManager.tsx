import { useAblyManager, useAblySubscription } from "../hooks";
import { useAppDispatch } from "../hooks";
import { setPresenceData } from "../features/AccountPage/accountSlice";
import { useRef } from "react";

export const AblyManager = ({ userEmail, enabled }: { userEmail: string | null, enabled: boolean }) => {
  const dispatch = useAppDispatch();
  const lastPresenceDataRef = useRef<string | null>(null);
  const { onPresenceUpdate, onListsUpdate } = useAblyManager();
  useAblySubscription({
    userEmail,
    enabled,
    subscribePresence: onPresenceUpdate,
    subscribeListsUpdate: onListsUpdate,
    onPresenceUpdate: (data) => {
      const dataString = JSON.stringify(data);
      if (lastPresenceDataRef.current !== dataString) {
        lastPresenceDataRef.current = dataString;
        dispatch(setPresenceData(data));
      }
    }
  });
  return null;
};

