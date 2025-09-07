const mongoose = require('mongoose');
const educationModelSchema = new mongoose.Schema({
  degree: String,
  university: String,
  college: String,
  year: String,
  description: String,
  icon:String,
},{
    collection: "education",
  });


module.exports = mongoose.model("education", educationModelSchema);