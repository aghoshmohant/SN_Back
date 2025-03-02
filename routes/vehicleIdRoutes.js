const express = require('express');
const router = express.Router();
const { getVehicleIdByUser } = require('../controllers/vehicleIdController');

// Route to get vehicle ID, owner_name, and vehicle_type by user ID, plus vehicle call IDs
router.get('/vehicleId/:userId', getVehicleIdByUser);

module.exports = router;