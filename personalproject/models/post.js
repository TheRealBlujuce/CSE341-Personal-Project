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
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
