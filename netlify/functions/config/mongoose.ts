import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;

if (!uri || !dbName) {
  throw new Error("[connectToDB] MONGODB_URI or MONGODB_DATABASE is missing");
}

export async function connectToDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("[connectToDB] Already connected to MongoDB");
    return mongoose;
  }

  console.log("[connectToDB] Connecting to MongoDB...");
  console.log("[connectToDB] Database:", dbName);

  await mongoose.connect(uri!, { dbName });
  console.log("[connectToDB] Connected to MongoDB");
  return mongoose;
}
