const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true
  },
  postDate: {
    type: String,
    required: true
  },
  postContent: {
    type: String,
    required: true,
    unique: true
  },
  gameTitle: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  reviewer: {
    type: String,
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
