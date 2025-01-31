
const db = require('../config/db');


// Signup Controller
exports.registerVehicle = async (req, res) => {
  const {
   owner_name,
   vehicle_type,
   vehicle_model,
    phone_number,
    email,
    district,
    
  } = req.body;

  // Basic input validation
  if (
    !owner_name||
    !vehicle_type ||
    !vehicle_model ||
    !phone_number ||
    !email ||
    !district 
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate phone number
  if (!/^\d{10}$/.test(phone_number)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }



  try {
   
    // Insert the new user into the database
   await db.query(
      `INSERT INTO vehicles(owner_name, vehicle_type, vehicle_model, phone_number, email, district)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, 
      [owner_name, vehicle_type, vehicle_model, phone_number, email, district]
    );
    return res.status(201).json({ message: 'Vehicle registered successfully!' });
    
  } catch (error) {
    console.error('Error during vehicle registration:', error);
    return res.status(500).json({ error: error.message || 'Something went wrong' });

  }
};
