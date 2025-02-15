const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT
const homeController = require('../controllers/homeController'); // Import the controller

// Route to fetch the logged-in user's full name, ID, and email
router.get('/home', authMiddleware, homeController.getHomePage);

module.exports = router;
