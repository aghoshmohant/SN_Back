const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Controller to register a vehicle
exports.registerVehicle = async (req, res) => {
  const {
    owner_name,
    vehicle_type,
    vehicle_model,
    phone_number,
    email,
    district,
    created_by, // New field
  } = req.body;

  if (
    !owner_name ||
    !vehicle_type ||
    !vehicle_model ||
    !phone_number ||
    !email ||
    !district ||
    !created_by
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!/^\d{10}$/.test(phone_number)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }

  try {
    const result = await db.query(
      `INSERT INTO vehicles(owner_name, vehicle_type, vehicle_model, phone_number, email, district, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [owner_name, vehicle_type, vehicle_model, phone_number, email, district, created_by]
    );

    res.status(201).json({
      message: 'Vehicle registered successfully!',
      vehicleId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error during vehicle registration:', error.message, error.stack, error);
    res.status(500).json({ error: error.message || 'Something went wrong while registering the vehicle.' });
  }
};

// Controller to fetch all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vehicles');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No vehicles found' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};
