const Comment = require('../models/comment');

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments
 *     responses:
 *       200:
 *         description: A list of all comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

// Get all comments
async function getAllComments(req, res) {
  try {
    const comments = await Comment.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error getting comments' });
  }
}

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a specific comment using an ID
 *     description: Retrieve a specific comment using its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// Get a specific comment by ID
async function getCommentById(req, res) {
  try {
    const id = req.params.id;
    const comment = await Comment.findById(id).exec();
    if (comment) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(comment);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: err });
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         comment:
 *           type: string
 *       required:
 *         - name
 *         - comment
 *
 * /new-comment:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment and add it to the database
 *     requestBody:
 *       description: The comment to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: A new comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: A field is missing data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error creating comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// Create a new comment
async function createComment(req, res) {
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.setHeader('Content-Type', 'application/json')
      .status(400)
      .json({ error: 'Name and comment are required' });
  }

  try {
    const newComment = new Comment({
      name,
      comment
    });

    const savedComment = await newComment.save();

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ id: savedComment._id });
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error creating comment' });
  }
}

/**
 * @swagger
 * /update-comment/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Update a comment in the database
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The comment data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       204:
 *         description: The comment has been updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Failed to find the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error updating the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// Update a comment
async function updateComment(req, res) {
  try {
    const id = req.params.id;
    const updatedComment = req.body;
    const result = await Comment.updateOne({ _id: id }, updatedComment);

    if (result.nModified > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.sendStatus(204);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ message: 'Comment not found' });
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error updating comment' });
  }
}

/**
 * @swagger
 * /delete-comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted from the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Failed to find the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error deleting the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// Delete a comment by ID
async function deleteComment(req, res) {
  try {
    const id = req.params.id;
    const result = await Comment.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.sendStatus(200);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ message: 'Comment not found' });
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error deleting comment' });
  }
}

module.exports.getAllComments = getAllComments;
module.exports.getCommentById = getCommentById;
module.exports.createComment = createComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;
