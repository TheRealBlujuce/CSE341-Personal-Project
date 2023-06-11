const express = require('express');
const router = express.Router();
const postController = require('../controller/post-controller');

// GET all posts
router.get('/posts', postController.getAllPosts);

// GET post by ID
router.get('/posts/:id', postController.getPostById);

// POST a new post
router.post('/new-post', postController.createPost);

// PUT update a post by ID
router.put('/update-post/:id', postController.updatePost);

// DELETE a post by ID
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;