const mongoose = require("../config/mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  lists: { type: Array, default: [] },
});

const UserData = mongoose.model("UserData", userSchema);

module.exports = UserData;
