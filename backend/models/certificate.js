const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: String,
    issuer: String,
    year: String,
    icon: String,
    path: String,
    created_at: Date,
  },
  { collection: "certifications", strict: false }
);

module.exports = mongoose.model("CertificateMongo", schema);
