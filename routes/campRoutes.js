const express = require('express');
const router = express.Router();
const { getCamps } = require('../controllers/campController'); // Import the controller

// Define route for fetching camps
router.get('/camps', getCamps);

module.exports = router;
