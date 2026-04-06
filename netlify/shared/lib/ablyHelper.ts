import Ably from "ably";

export const publishSystemLog = async (log: {
  key: string;
  status: string;
  details?: string;
  timestamp: string;
  stats?: any;
}) => {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    console.warn("[publishSystemLog] Missing ABLY_API_KEY");
    return;
  }

  try {
    const ably = new Ably.Rest({ key: apiKey });
    const channel = ably.channels.get("system:logs");
    await channel.publish("new-log", log);
  } catch (error) {
    console.error("[publishSystemLog] Error publishing to Ably:", error);
  }
};
