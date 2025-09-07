const mongoose = require('mongoose');

const SkillItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  id: { type: String, required: true },
  image: { type: String, required: true },
  proficiency: { type: Number, required: true },
  skill: { type: String, required: true },
  stage: { type: String, required: true }
}, { _id: false });

const SkillModelSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: { type: String, required: true },
  experienceLevel: { type: Number, required: true },
  skills: { type: [SkillItemSchema], required: true },
  title: { type: String, required: true }
}, {
  collection: "Skills"
});

module.exports = mongoose.model("Skills", SkillModelSchema);
