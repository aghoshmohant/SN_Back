const express = require('express');
const { updatePassword } = require('../controllers/adminProfileController');

const router = express.Router();

router.post('/updatepassword', updatePassword);

module.exports = router;
