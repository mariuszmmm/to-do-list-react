import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";

export const useCancelNotificationMutation = () => {
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const token = await getUserToken();
      if (!token) throw new Error("No auth token");

      const response = await axios.delete(`/notification-cancel`, {
        params: { id: notificationId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
};
