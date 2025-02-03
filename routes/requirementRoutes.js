const express = require('express');
const router = express.Router();
const { getRequirements } = require('../controllers/requirementController');

// Route to get all requirements
router.get('/requirements', getRequirements);

module.exports = router;
