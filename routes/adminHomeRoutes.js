const express = require('express');
const { getVerifiedAuthorities } = require('../controllers/adminHomeController');

const router = express.Router();

// Route to fetch verified authorities
router.get('/adminhome', getVerifiedAuthorities);

module.exports = router;
