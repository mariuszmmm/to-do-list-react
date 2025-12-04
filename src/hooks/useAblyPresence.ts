import { useEffect, useState } from "react";
import ably from "../utils/ably";

export const useAblyPresence = (channelName: string, userId: string) => {
  const [membersCount, setMembersCount] = useState(0);

  useEffect(() => {
    if (!channelName || !userId) return;
    const channel = ably.channels.get(channelName);
    let isMounted = true;

    const updateCount = () => {
      (channel.presence.get as any)((err: any, members: any[]) => {
        if (!err && isMounted) {
          setMembersCount(Array.isArray(members) ? members.length : 0);
        }
      });
    };

    channel.presence.enter({ userId });
    updateCount();
    channel.presence.subscribe("enter", updateCount);
    channel.presence.subscribe("leave", updateCount);

    return () => {
      isMounted = false;
      channel.presence.leave();
      channel.presence.unsubscribe("enter", updateCount);
      channel.presence.unsubscribe("leave", updateCount);
    };
  }, [channelName, userId]);

  return membersCount;
};
