const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  db_username: {
    type: String,
    required: true
  },
  db_postTopic: {
    type: String,
    required: true
  },
  db_postText: {
    type: String
  },
  db_postVisibility: {
    type: String,
    enum: ['public', 'private'], // Example visibility options
    required: true
  },
  db_postCreationDate: {
    type: String,
    required: true
  },
  db_postModificationDate: {
    type: String,
    required: true
  },
  db_tags: {
    type: [String], // Array of strings for tags
    default: []
  },
  db_postEditedStatus: {
    type: Boolean,
    default: false
  },
  db_postPics: {
    type: [String]
  }
});


module.exports = mongoose.model("post",postSchema)