const express = require('express');
const router = express.Router();
const postController = require('../controller/post-controller');

router.get('/', postController.getAllposts);

router.get('/:id', postController.getpostById);

// POST a new post
app.post('/', postController.createpost);

// PUT update a post by ID
app.put('/:id', postController.updatepost);

// DELETE a post by ID
app.delete('/:id', postController.deletepost);
