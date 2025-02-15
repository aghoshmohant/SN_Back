const express = require('express');
const { registerVehicle, getVehicles } = require('../controllers/vehicleController');
const router = express.Router();

// Enable CORS for all routes
const cors = require('cors');
router.use(cors());

// POST route for registering a new vehicle
router.post('/', registerVehicle);

// GET route for fetching the list of all vehicles
router.get('/', getVehicles);

module.exports = router;
