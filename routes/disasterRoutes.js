const express = require('express');
const { getDisasters, registerDisasters, upload, approveDisaster, rejectDisaster } = require('../controllers/disasterController');
const router = express.Router();

// POST route for registering a new disaster
router.post('/', upload, registerDisasters);

// GET route for fetching the list of all unverified disasters
router.get('/', getDisasters);

// PUT route to approve a disaster
router.put('/approve/:id', approveDisaster);

// DELETE route to reject a disaster
router.delete('/reject/:id', rejectDisaster);

module.exports = router;
