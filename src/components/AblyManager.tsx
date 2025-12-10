import { useAblyManager, useAblySubscription } from "../hooks";
import { useAppDispatch } from "../hooks";
import { setPresenceData } from "../features/AccountPage/accountSlice";

export const AblyManager = ({ userEmail, enabled }: { userEmail: string | null, enabled: boolean }) => {
  const dispatch = useAppDispatch();
  useAblyManager();
  useAblySubscription({
    userEmail,
    enabled,
    onPresenceUpdate: (data) => {
      dispatch(setPresenceData(data));
    }
  });
  return null;
};

