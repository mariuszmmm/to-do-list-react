import mongoose from "mongoose";
const { Schema } = mongoose;

const ListSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  updatedAt: { type: String, required: true },
  version: { type: Number, required: true, min: 0, default: 0 },
  taskList: { type: Array, default: [] },
});

const UserDataSchema = new Schema({
  email: { type: String, required: true, unique: true },
  account: {
    type: String,
    enum: ["active", "deleted", "pending"],
    required: true,
  },
  lists: { type: [ListSchema], default: [] },
});

const UserData =
  mongoose.models.UserData || mongoose.model("UserData", UserDataSchema);

export type UserDoc = mongoose.Document & {
  email: string;
  account: "active" | "deleted" | "pending";
  lists: {
    id: string;
    date: string;
    name: string;
    updatedAt: string;
    version: number;
    taskList: any[];
  }[];
};

export default UserData;
