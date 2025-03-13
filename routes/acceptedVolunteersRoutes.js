const express = require('express');
const router = express.Router();
const acceptedVolunteersController = require('../controllers/acceptedVolunteersController');

// Get all accepted volunteers
router.get('/accepted-volunteers', acceptedVolunteersController.getAcceptedVolunteers);

module.exports = router;