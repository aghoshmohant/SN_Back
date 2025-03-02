const express = require('express');
const router = express.Router();
const { getVolunteerIdByUser } = require('../controllers/volunteerIdController');

// Route to get volunteer ID by user ID
router.get('/volunteerId/:userId', getVolunteerIdByUser);

module.exports = router;
