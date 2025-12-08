import Ably from "ably";

const ably = new Ably.Rest({
  key: process.env.ABLY_API_KEY,
  idempotentRestPublishing: true,
});

export const publishAblyUpdate = async (email: string, data: any) => {
  try {
    if (!process.env.ABLY_API_KEY) {
      console.error("ABLY_API_KEY is not configured");
      return;
    }

    const channel = ably.channels.get(`user:${email}:lists`);
    await channel.publish("lists-updated", data);
  } catch (error) {
    console.error("Failed to send Ably notification:", error);
  }
};

export const publishConfirmation = async (email: string, data: any) => {
  try {
    if (!process.env.ABLY_API_KEY) {
      console.error("ABLY_API_KEY is not configured");
      return;
    }

    const channel = ably.channels.get(`user:${email}:confirmation`);
    await channel.publish("user-confirmed", data);
    console.log(`[Ably] Published confirmation to user:${email}:confirmation`);
  } catch (error) {
    console.error("Failed to send Ably confirmation:", error);
  }
};
