const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

  doc_id: { type: Number, required: true, unique: true }, // Shared key with MySQL

  owner_id: { type: Number, required: true }, // userid
  owner_username: { type: String, required: true }, // exact MySQL username

  title: { type: String, required: true },
  content: { type: String, required: true },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  collection: "documents"
});

module.exports = mongoose.model("Document", DocumentSchema);
