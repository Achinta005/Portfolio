const mongoose = require('mongoose');

const contactModelSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
  },
  {
    collection: "contact_info", 
  }
);

module.exports = mongoose.model('Contact', contactModelSchema);
