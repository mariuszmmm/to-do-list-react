import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;
if (!uri || !dbName) {
  throw new Error("[connectToDB] MONGODB_URI or MONGODB_DATABASE is missing");
}

export async function connectToDB(retries = MAX_RETRIES) {
  if (mongoose.connection.readyState === 1) {
    console.log("[connectToDB] Already connected to MongoDB");
    return mongoose;
  }

  try {
    console.log("[connectToDB] Connecting to MongoDB...");
    await mongoose.connect(uri!, { dbName });
    console.log("[connectToDB] Connected to MongoDB");
    return mongoose;
  } catch (error) {
    if (retries > 0) {
      const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1);
      console.warn(
        `MongoDB connect failed, retrying in ${
          delay / 1000
        }s... (${retries} left)`
      );
      await new Promise((res) => setTimeout(res, delay));
      return connectToDB(retries - 1);
    }

    console.error("[connectToDB] Connection error:", error);

    if (process.env.NETLIFY || process.env.NODE_ENV !== "production") {
      console.error(
        "[connectToDB] Max retries reached. Exiting process to trigger restart."
      );
      process.exit(1);
    }
    throw error;
  }
}
