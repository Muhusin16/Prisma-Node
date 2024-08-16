const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const authenticateToken = require('../middleware/authentication');

const router = express.Router();

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);

// User routes
router.get('/users', authenticateToken, userController.getAllUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

module.exports = router;
