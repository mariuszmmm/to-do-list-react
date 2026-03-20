import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";
import { useAppSelector } from "../redux/redux";
import { selectLoggedUserEmail } from "../../features/AccountPage/accountSlice";

export interface ScheduledNotification {
  id: string;
  content: string;
  heading: string;
  send_after: number;
  data: any;
}

/**
 * Hook pobierający listę zaplanowanych powiadomień.
 * Wykorzystuje adres e-mail zalogowanego użytkownika jako identyfikator.
 */
export const useScheduledNotificationsQuery = () => {
  const email = useAppSelector(selectLoggedUserEmail);

  return useQuery<ScheduledNotification[]>({
    queryKey: ["scheduledNotifications", email],
    queryFn: async () => {
      const token = await getUserToken();
      if (!token || !email) return [];

      const response = await axios.get(
        `/.netlify/functions/get-scheduled-notifications`,
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    enabled: !!email,
    refetchInterval: 60000, // Odświeżaj co 60 sekund
  });
};
