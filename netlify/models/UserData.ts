import mongoose from "mongoose";
import { List, Task, Image } from "../../src/types";
const { Schema } = mongoose;

const ImageSchema = new Schema<Image>({
  imageUrl: { type: String, required: false, default: null },
  publicId: { type: String, required: false, default: null },
  format: { type: String, required: false, default: null },
  createdAt: { type: String, required: false, default: null },
  displayName: { type: String, required: false, default: null },
  height: { type: Number, required: false, default: null },
  width: { type: Number, required: false, default: null },
  originalFilename: { type: String, required: false, default: null },
});

const TaskSchema = new Schema<Task>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  done: { type: Boolean, required: true },
  date: { type: String, required: true },
  updatedAt: { type: String, required: true },
  editedAt: { type: String, required: false },
  completedAt: { type: String, required: false },
  deletedAt: { type: String, required: false },
  status: {
    type: String,
    enum: ["new", "edited", "updated", "deleted", "synced"],
    required: false,
  },
  image: { type: ImageSchema, required: false, default: null },
});

const ListSchema = new Schema<List>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  updatedAt: { type: String, required: true },
  version: { type: Number, required: true, min: 0, default: 0 },
  taskList: { type: [TaskSchema], default: [] },
  deletedTasks: { type: [TaskSchema], default: [] },
});

const UserDataSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true },
  account: {
    type: String,
    enum: ["active", "deleted", "pending"],
    required: true,
  },
  lists: { type: [ListSchema], default: [] },
});

const UserData =
  (mongoose.models.User as mongoose.Model<UserDoc>) ||
  mongoose.model<UserDoc>("User", UserDataSchema);

export type UserDoc = mongoose.Document & {
  email: string;
  account: "active" | "deleted" | "pending";
  lists: List[];
};

export default UserData;
