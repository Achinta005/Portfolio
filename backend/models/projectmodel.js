const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    category: { type: String },
    technologies: { type: [String] },
    githubUrl: { type: String },
    liveUrl: { type: String },
    image: { type: String },
    order: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    modelAccuracy: { type: Number },
    modelFeatures: { type: Number },
  },
  {
    collection: "projectmodel",
    timestamps: false
  }
);

module.exports = mongoose.model("ProjectModelMongo", projectSchema);