const express = require('express');
const { registerOrg } = require('../controllers/orgController');

const router = express.Router();


router.post('/', registerOrg);

module.exports = router;