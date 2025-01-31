const express = require('express');
const { registerVehicle } = require('../controllers/vehicleController');
const router = express.Router();


router.post('/', registerVehicle);

module.exports = router;