// routes/postRoutes.js
const express = require('express');
const postController = require('../controller/postcontroller');
const authenticateToken = require('../middleware/authentication');
const router = express.Router();

router.post('/posts', authenticateToken, postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
