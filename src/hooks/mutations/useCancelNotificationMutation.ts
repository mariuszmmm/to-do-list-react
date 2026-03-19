import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getUserToken } from "../../utils/auth/getUserToken";

export const useCancelNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const token = await getUserToken();
      if (!token) throw new Error("No auth token");

      const response = await axios.delete(`/.netlify/functions/cancel-notification`, {
        params: { id: notificationId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
};
