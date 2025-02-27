const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { signupValidationRules, validateInputs } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify authentication
const router = express.Router();

// Routes
router.post('/signup', signupValidationRules, validateInputs, signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
