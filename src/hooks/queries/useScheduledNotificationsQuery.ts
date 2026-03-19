import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";
import { getLocalMasterId } from "../../utils/notifications/masterId";

export interface ScheduledNotification {
  id: string;
  content: string;
  heading: string;
  send_after: number;
  data: any;
}

export const useScheduledNotificationsQuery = () => {
  const masterId = getLocalMasterId();

  return useQuery<ScheduledNotification[]>({
    queryKey: ["scheduledNotifications", masterId],
    queryFn: async () => {
      const token = await getUserToken();
      if (!token || !masterId) return [];

      const response = await axios.get(`/.netlify/functions/get-scheduled-notifications`, {
        params: { masterId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: !!masterId,
    refetchInterval: 30000, // Odświeżaj co 30 sekund
  });
};
