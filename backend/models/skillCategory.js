const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: Number,
    title: String,
    description: String,
    experience_level: Number,
    created_at: Date,
  },
  { collection: "skills_categories", strict: false }
);

module.exports = mongoose.model("SkillCategoryMongo", schema);