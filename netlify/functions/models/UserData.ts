import mongoose from "../config/mongoose";
const { Schema } = mongoose;

const ListSchema = new Schema({
  id: { type: String, required: true },
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
});

const UserData = mongoose.model("UserData", UserDataSchema);

export default UserData;
