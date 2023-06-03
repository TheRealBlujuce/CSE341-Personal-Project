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
      res.status(404).json({ message: 'post not found' });
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
 *       required:
 *         - postTitle
 *         - postDate
 *         - postContent
 *
 * /new-post:
 *   post:
 *     summary: Create a New post
 *     description: Create a new post and add it to the db
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
 */
// Create a new post
async function createPost(req, res) {
  const { postTitle, postDate, postContent} = req.body;

  if (!postTitle || !postDate || !postContent) {
    return res.setHeader('Content-Type', 'application/json')
      .status(400)
      .json({ error: 'All fields are required' }, console.log('Missing a Field.'), console.log('Request Body', req.body));
  }

  try {
    const newpost = new Post({
      postTitle,
      postDate,
      postContent
    });

    const savedpost = await newpost.save();

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ id: savedpost._id });
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error creating post' });
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
 *       required:
 *         - postTitle
 *         - postDate
 *         - postContent
 *
 * /update-post/{id}:
 *   put:
 *     summary: Update post
 *     description: updating a post in the db
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of post to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: the post to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The post has been updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Failed to find post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
async function updatePost(req, res) {
  try {
    const id = req.params.id;
    const updatedpost = req.body;
    const result = await Post.updateOne({ _id: id }, updatedpost);

    if (result.nModified > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.sendStatus(204);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({ message: 'post not found' }, console.log(id));
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
 *     description: Delete a post from the db
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletes a post from the database
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
      res.status(404).json({ message: 'post not found' });
    }
  } catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Error deleting post' });
  }
}

module.exports.getAllposts = getAllPosts;
module.exports.getPostById = getPostById;
module.exports.createPost = createPost;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;


