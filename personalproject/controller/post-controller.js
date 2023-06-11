const Post = require('../models/post');

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     responses:
 *       200:
 *         description: A list of all posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

// Get all posts
async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error getting posts' });
  }
}

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a specific post using an ID
 *     description: Retrieve a specific post using their unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
// Get a specific post by ID
async function getPostById(req, res) {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).exec();
    if (post) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(post);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({ message: 'Post not found' });
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
 *     Post:
 *       type: object
 *       properties:
 *         postTitle:
 *           type: string
 *         postDate:
 *           type: string
 *         postContent:
 *           type: string
 *         gameTitle:
 *           type: string
 *         platform:
 *           type: string
 *         rating:
 *           type: string
 *         reviewer:
 *           type: string
 *       required:
 *         - postTitle
 *         - postDate
 *         - postContent
 *         - gameTitle
 *         - platform
 *         - rating
 *         - reviewer
 *
 * /new-post:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post and add it to the database
 *     requestBody:
 *       description: The post to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: A new post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: A field is missing data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error creating post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
// Create a new post
async function createPost(req, res) {
  const { postTitle, postDate, postContent, gameTitle, platform, rating, reviewer } = req.body;

  if (!postTitle || !postDate || !postContent || !gameTitle || !platform || !rating || !reviewer) {
    return res.setHeader('Content-Type', 'application/json')
      .status(400)
      .json({ error: 'All fields are required' });
  }

  try {
    const newPost = new Post({
      postTitle,
      postDate,
      postContent,
      gameTitle,
      platform,
      rating,
      reviewer
    });

    const savedPost = await newPost.save();

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ id: savedPost._id });
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error creating post' });
  }
}

/**
 * @swagger
 * /update-post/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a post in the database
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The post data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       204:
 *         description: The post has been updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Failed to find the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error updating the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
// Update a post
async function updatePost(req, res) {
  try {
    const id = req.params.id;
    const updatedPost = req.body;
    const result = await Post.updateOne({ _id: id }, updatedPost);

    if (result.nModified > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.sendStatus(204);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error updating post' });
  }
}

/**
 * @swagger
 * /delete-post/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted from the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Failed to find the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error deleting the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
// Delete a post by ID
async function deletePost(req, res) {
  try {
    const id = req.params.id;
    const result = await Post.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.sendStatus(200);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error deleting post' });
  }
}

module.exports.getAllPosts = getAllPosts;
module.exports.getPostById = getPostById;
module.exports.createPost = createPost;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;
