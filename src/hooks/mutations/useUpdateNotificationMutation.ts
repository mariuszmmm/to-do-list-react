import { useMutation } from "@tanstack/react-query";
import { updateNotification } from "../../api/notificationApi";

export const useUpdateNotificationMutation = () => {
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: { id: string; date: string } }) =>
      updateNotification(token, payload),
  });
};
