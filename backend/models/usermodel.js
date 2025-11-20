const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: { type: Number, required: true }, // numeric ID from MySQL
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "viewer" },
  Email: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},
{
  collection: "usernames",
  version_key: false
});

module.exports = mongoose.model("User", UserSchema);