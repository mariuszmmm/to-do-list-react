import Ably from "ably";

export const publishAblyUpdate = async (
  email: string,
  data: { email: string; lists: any[] }
) => {
  try {
    if (!process.env.ABLY_API_KEY) {
      console.error("ABLY_API_KEY is not configured");
      return;
    }

    const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    const channel = ably.channels.get(`user:${email}:lists`);

    await channel.publish("lists-updated", data);
    console.log("Ably notification sent for user:", email);
  } catch (error) {
    console.error("Failed to send Ably notification:", error);
    // Nie rzucamy błędu - to nie powinno zatrzymać głównej operacji
  }
};
