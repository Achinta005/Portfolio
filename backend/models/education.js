const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: Number,
    id: Number,
    college: String,
    university: String,
    degree: String,
    description: String,
    year: String,
    icon: String,
    created_at: Date,
  },
  { collection: "education", strict: false }
);

module.exports = mongoose.model("EducationMongo", schema);