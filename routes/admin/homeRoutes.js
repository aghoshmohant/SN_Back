const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { getHome } = require('../../controllers/adminHomeController'); // Destructure getHome

router.get('/', getHome); // Now you're passing the getHome function

module.exports = router;