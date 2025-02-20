const express = require('express');
const router = express.Router();
const { sendDisasterEmails } = require('../controllers/testController');

// Route to send disaster emails
router.post('/send-disaster-emails', sendDisasterEmails);

module.exports = router;