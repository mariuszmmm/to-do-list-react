import Ably from "ably";

export const getAblyUsage = async () => {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    console.warn("[getAblyUsage] Missing ABLY_API_KEY");
    return null;
  }

  try {
    const ably = new Ably.Rest({ key: apiKey });
    // Fetch stats for the current month. If using free tier:
    // messages limit: 6000000, connections limit: 200
    const stats = await ably.stats({ unit: "month", limit: 1 });
    // console.log("[getAblyUsage] Raw usage from Ably:", stats);

    const items = stats.items || [];
    const currentStats = items.length > 0 ? items[0] : null;

    console.log("[getAblyUsage] Current stats:", currentStats);

    const messages = (currentStats as any).messages?.all?.all?.count || 0;
    const peakConnections = (currentStats as any).connections?.all?.peak || 0;

    return {
      messages: {
        used: messages,
        limit: 6000000,
      },
      connections: {
        used: peakConnections,
        limit: 200,
      },
    };
  } catch (error) {
    console.error("[getAblyUsage] Error fetching Ably stats:", error);
    return null;
  }
};
