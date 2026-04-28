const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  birthday: { type: String },
  location: { type: String },
  gender: { type: String },
  avatar: { type: String },
  googleId: { type: String },
  profileSetupDone: { type: Boolean, default: false },
  communities: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);