import Ably from "ably";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

async function init() {
  try {
    const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    // fetch stats for current month
    const stats = await ably.stats({ unit: "month", limit: 1 });
    console.log(JSON.stringify(stats.items[0], null, 2));
  } catch (err) {
    console.error(err);
  }
}

init();
