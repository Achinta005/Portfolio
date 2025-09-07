const mongoose = require('mongoose');
const certificateModelSchema = new mongoose.Schema({
  icon: String,
  issuer: String,
  name: String,
  path: String,
  year: String
},{
    collection: "certifications",
  });


module.exports = mongoose.model("certifications", certificateModelSchema);