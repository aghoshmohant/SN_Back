const express = require('express');
const router = express.Router();
const { getDonors } = require('../controllers/donorController');

// Correct the route to just "/"
router.get('/', getDonors);  // This makes it /api/donors

module.exports = router;