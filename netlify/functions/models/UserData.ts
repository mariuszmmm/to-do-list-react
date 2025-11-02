import mongoose from "../config/mongoose";
const { Schema } = mongoose;

const ListSchema = new Schema({
  id: { type: String, required: true },
  date: { type: String, required: false },
  name: { type: String, required: true },
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
  version: { type: Number, default: 1 },
});

const UserData = mongoose.model("UserData", UserDataSchema);

export default UserData;
