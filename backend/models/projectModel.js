const mongoose = require('mongoose');
const projectModelSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String,
  technologies: {
    type: [String],
    default: [],
  },
  liveUrl: String,
  githubUrl: String,
},{
    collection: "projectmodel",
  });


module.exports = mongoose.model("projectModel", projectModelSchema);

