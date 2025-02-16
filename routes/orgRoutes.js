const express = require('express');
const { registerOrg, getOrganizations, approveOrganization, rejectOrganization } = require('../controllers/orgController');
const router = express.Router();

const cors = require('cors');
router.use(cors());

// POST route for registering a new organization
router.post('/', registerOrg);

// GET route for fetching the list of all organizations
router.get('/', getOrganizations);

// PUT route for approving an organization
router.put('/approve/:id', approveOrganization);

// DELETE route for rejecting an organization
router.delete('/reject/:id', rejectOrganization);

module.exports = router;
