import axios from "axios";

export const scheduleNotification = async (
  token: string,
  payload: {
    taskId: string;
    content: string;
    date: string;
    userEmail: string;
    subscriptionId: string;
    heading?: string;
    buttonText?: string;
    listName?: string;
    lang?: string;
  },
) => {
  console.log("[NotificationAPI] Scheduling notification: ", payload);

  const response = await axios.post("/schedule-notification", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("[NotificationAPI] Server response: ", response.data);

  return response.data;
};
