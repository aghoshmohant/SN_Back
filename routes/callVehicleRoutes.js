const express = require('express');
const { registerVehicleCall, getVehicleCalls } = require('../controllers/callVehicleController');

const router = express.Router();

// Route to register a new vehicle call
router.post('/', registerVehicleCall);

// Route to get all vehicle calls
router.get('/', getVehicleCalls);

module.exports = router;
