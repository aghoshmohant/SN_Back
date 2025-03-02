const express = require('express');
const { registerVehicleCall, getVehicleCalls, acceptVehicleCall, getAcceptedVehicleCalls } = require('../controllers/callVehicleController');

const router = express.Router();

// Route to register a new vehicle call
router.post('/', registerVehicleCall);

// Route to get all vehicle calls
router.get('/', getVehicleCalls);

// Route to accept a vehicle call
router.post('/accept', acceptVehicleCall);

// Route to get accepted vehicle calls for a user
router.get('/accepted-calls/:userId', getAcceptedVehicleCalls);

module.exports = router;