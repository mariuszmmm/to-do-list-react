import { useMutation } from "@tanstack/react-query";
import { scheduleNotification } from "../../api/notificationApi";

export const useScheduleNotificationMutation = () => {
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: any }) =>
      scheduleNotification(token, payload),
  });
};
