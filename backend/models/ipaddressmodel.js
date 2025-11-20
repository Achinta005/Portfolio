const mongoose = require("mongoose");

const ipSchema = new mongoose.Schema({
  user_id: Number,
  ipaddress: String,
  timestamp: Date
});

module.exports = mongoose.model("IPModel", ipSchema, "ipaddress");