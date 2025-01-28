const mongoose = require('../config/mongooseConfig');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  lists: { type: Array, default: [] },
});

const User = mongoose.model('User', userSchema);

module.exports = User;