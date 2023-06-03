const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_DB_CONNECTION_STRING;
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
// Add middleware to serve static files from the 'public' directory
app.use(express.static('frontend'));

// Connect to MongoDB
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB database');
}).catch(err => {
  console.error(err);
});

// create the options for the swagger ui
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for My API',
    },
    servers: [
      {
        url: '',
        description: 'Local server',
      },
      {
        url: '',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Post: {
          type: 'object',
          properties: {
            postTitle: { type: 'string' },
            postDate: { type: 'string' },
            postContent: { type: 'string' },
          },
          required: ['postTitle', 'postDate', 'postContent']
        }
      }
    },
    basePath: '/'
  },
  apis: ['controller/post-controller.js'],
};

// Import the post controller
const postController = require('./controller/post-controller');

// Add middleware for parsing request body as JSON
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: "frontend" });
});

// GET all posts
app.get('/posts', postController.getAllposts);

// GET post by ID
app.get('/posts/:id', postController.getPostById);

// POST a new post
app.post('/new-post', postController.createPost);

// PUT update a post by ID
app.put('/update-post/:id', postController.updatePost);

// DELETE a post by ID
app.delete('/delete-post/:id', postController.deletePost);

// Route for Swagger Doc
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Listen on Port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
