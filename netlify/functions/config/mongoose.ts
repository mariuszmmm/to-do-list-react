import mongoose from "mongoose";
import "dotenv/config";
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

mongoose
  .connect(uri, { dbName })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default mongoose;
