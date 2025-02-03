import mongoose from "../config/mongoose";
const { Schema } = mongoose;

const userDataSchema = new Schema({
  email: { type: String, required: true, unique: true },
  lists: { type: Array, default: [] },
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
