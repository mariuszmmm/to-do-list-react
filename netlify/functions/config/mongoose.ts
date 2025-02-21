import mongoose from "mongoose";
import "dotenv/config";
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;

if (!uri || !dbName) {
  throw new Error("MONGODB_URI  or MONGODB_DATABASE is missing in .env file");
}

mongoose
  .connect(uri, { dbName })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default mongoose;
