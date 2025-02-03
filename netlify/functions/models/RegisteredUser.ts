import mongoose from "../config/mongoose";
const { Schema } = mongoose;

const registeredUserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  confirmed: { type: Boolean, default: false },
});

const RegisteredUser = mongoose.model("RegisteredUser", registeredUserSchema);

module.exports = RegisteredUser;
