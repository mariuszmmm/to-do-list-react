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
  const response = await axios.post("/schedule-notification", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateNotification = async (
  token: string,
  payload: {
    id: string;
    date: string;
  },
) => {
  const response = await axios.put("/update-notification", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
