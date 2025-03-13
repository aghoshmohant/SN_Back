const db = require('../config/db');
const nodemailer = require('nodemailer');

// Function to send email notifications
const sendEmailToVehicleOwners = async (vehicleCall) => {
  try {
    const { vehicle_type, location, district, count, contact_number, map_link } = vehicleCall;

    const result = await db.query(
      `SELECT email FROM vehicles WHERE vehicle_type = $1`,
      [vehicle_type]
    );

    if (result.rows.length === 0) {
      console.log('No vehicles found for the specified type.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'aghoshmohant@gmail.com',
        pass: 'dpwcyaboxthbdihf',
      },
    });

    const mailOptions = {
      from: 'aghoshmohant@gmail.com',
      to: result.rows.map((row) => row.email),
      subject: `Vehicle Call for Type: ${vehicle_type}`,
      html: `
        <p>Dear Vehicle Owner,</p>
        <p>A new vehicle call has been registered:</p>
        <ul>
          <li>Vehicle Type: ${vehicle_type}</li>
          <li>Location: ${location}</li>
          <li>District: ${district}</li>
          <li>Count: ${count}</li>
          <li>Contact Number: ${contact_number}</li>
          <li><a href="${map_link}" target="_blank">View Map</a></li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Emails sent successfully to vehicle owners.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Controller to register a new vehicle call
exports.registerVehicleCall = async (req, res) => {
  const { location, district, count, vehicle_type, map_link, contact_number } = req.body;

  if (!location || !district || !count || !vehicle_type || !contact_number) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const result = await db.query(
      `INSERT INTO vehicle_calls (location, district, count, vehicle_type, map_link, contact_number, remaining_vehicles)
       VALUES ($1, $2, $3, $4, $5, $6, $3) RETURNING *`,
      [location, district, count, vehicle_type, map_link, contact_number]
    );

    const vehicleCall = result.rows[0];
    await sendEmailToVehicleOwners(vehicleCall);
    res.status(201).json(vehicleCall);
  } catch (error) {
    console.error('Error during vehicle call registration:', error);
    res.status(500).json({ error: 'Something went wrong while registering the vehicle call.' });
  }
};

// Controller to fetch all vehicle calls
exports.getVehicleCalls = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vehicle_calls');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No vehicle calls found' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching vehicle calls:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle calls' });
  }
};

// Controller to accept a vehicle call
exports.acceptVehicleCall = async (req, res) => {
  const { vehicle_id, vehicle_type, vehicle_call_id, user_id } = req.body;

  if (!vehicle_id || !vehicle_type || !vehicle_call_id || !user_id) {
    return res.status(400).json({ error: 'All fields (vehicle_id, vehicle_type, vehicle_call_id, user_id) are required' });
  }

  try {
    const callCheck = await db.query(
      'SELECT remaining_vehicles FROM vehicle_calls WHERE id = $1',
      [vehicle_call_id]
    );
    if (callCheck.rows.length === 0 || callCheck.rows[0].remaining_vehicles <= 0) {
      return res.status(400).json({ error: 'Vehicle call not found or no slots available' });
    }

    const existingAcceptance = await db.query(
      'SELECT * FROM accepted_vehicles WHERE vehicle_call_id = $1 AND vehicle_id = $2',
      [vehicle_call_id, vehicle_id]
    );

    if (existingAcceptance.rows.length > 0) {
      return res.status(400).json({ error: 'This vehicle has already accepted this call' });
    }

    const result = await db.query(
      `INSERT INTO accepted_vehicles (vehicle_id, vehicle_type, vehicle_call_id, accepted_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [vehicle_id, vehicle_type, vehicle_call_id, user_id]
    );

    await db.query(
      'UPDATE vehicle_calls SET remaining_vehicles = remaining_vehicles - 1 WHERE id = $1',
      [vehicle_call_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error accepting vehicle call:', error);
    res.status(500).json({ error: 'Something went wrong while accepting the vehicle call.' });
  }
};

// Controller to fetch accepted vehicle calls for a user
exports.getAcceptedVehicleCalls = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.query(
      'SELECT vehicle_call_id FROM accepted_vehicles WHERE accepted_by = $1',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching accepted vehicle calls:', error);
    res.status(500).json({ error: 'Failed to fetch accepted vehicle calls' });
  }
};