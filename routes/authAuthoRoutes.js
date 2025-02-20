const express = require('express');
const { signup, login } = require('../controllers/authController');
const { signupValidationRules, validateInputs } = require('../middleware/validationMiddleware');
const router = express.Router();

// Routes
router.post('/', signupValidationRules, validateInputs, signup);
router.post('/login', login);
  
module.exports = router;
