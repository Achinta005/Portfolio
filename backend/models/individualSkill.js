const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: Number,
    skill_category_id: Number,
    skill_id: String,
    skill_name: String,
    category: String,
    description: String,
    proficiency: Number,
    stage: String,
    color: String,
    image: String,
    created_at: Date,
  },
  { collection: "individual_skills", strict: false }
);

module.exports = mongoose.model("IndividualSkillMongo", schema);
