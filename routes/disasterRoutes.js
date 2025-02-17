const express = require('express');
const { getDisasters, registerDisasters, upload } = require('../controllers/disasterController');
const router = express.Router();

// POST route for registering a new disaster
router.post('/', upload, registerDisasters);

// GET route for fetching the list of all disasters
router.get('/', getDisasters);

module.exports = router;
