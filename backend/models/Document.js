const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    default: '', // A document can be created with just a title
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId, // This is the link
    ref: 'Username',                           // It refers to a document in the 'User' collection
    required: true,
    index: true, // Adds a database index to owner_id for faster queries
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

// Create the model from the schema
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
