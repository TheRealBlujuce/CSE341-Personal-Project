const express = require('express');
const session = require('express-session');
const http = require('http');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_DB_CONNECTION_STRING;
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

// Configure express-session middleware
app.use(
  session({
    secret: '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', // Replace with your own secret key
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Define Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '288535704920-khk18jf1pah11btbgrbmn4acvomh9lks.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // You can perform user registration or login logic here
      // 'profile' object contains user information from Google
      return done(null, profile);
    }
  )
);

// Configure passport serialization and deserialization
passport.serializeUser((user, done) => {
  // Serialize user object
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize user object
  done(null, user);
});

// Add middleware for parsing request body as JSON
app.use(express.json());

// Define routes

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // User is authenticated, allow access to the next middleware/route
    return next();
  }
  // User is not authenticated, redirect to the login page
  res.redirect('/login');
};

// Auth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to the home page
    res.redirect('/home');
  }
);

// Login Route
app.get('/login', (req, res) => {
  // Render the login page here
  res.sendFile('login.html', { root: 'frontend' });
});

// Home route
app.get('/home', ensureAuthenticated, (req, res) => {
  // Render the index page here
  res.sendFile('index.html', { root: 'frontend' });
});

// Logout route
app.get('/logout', (req, res) => {
  // Log out the user and destroy the session
  req.logout((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle the error accordingly
    }
    // Redirect to the login page
    req.session.destroy();
    res.redirect('/login');
  });
});


// Define Requests

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
