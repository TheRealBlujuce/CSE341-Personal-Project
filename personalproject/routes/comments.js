const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment-controller');

// GET all comments
router.get('/comments', commentController.getAllComments);

// GET comment by ID
router.get('/comments/:id', commentController.getCommentById);

// POST a new comment
router.post('/new-comment', commentController.createComment);

// PUT update a comment by ID
router.put('/update-comment/:id', commentController.updateComment);

// DELETE a comment by ID
router.delete('/delete-comment/:id', commentController.deleteComment);

module.exports = router;
