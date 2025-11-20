const mongoose = require("mongoose");

const AdminIPSchema = new mongoose.Schema({
  ip_id: { type: Number, required: true, unique: true },
  ip: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, {
  collection: "admin_ipaddress"
});

module.exports = mongoose.model("AdminIPModel", AdminIPSchema);