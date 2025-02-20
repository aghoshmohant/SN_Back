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

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'aghoshmohant@gmail.com',  // Environment variable for email
        pass: 'dpwcyaboxthbdihf',  // Environment variable for app password
      },
    });

    // Email content
    const mailOptions = {
      from: 'aghoshmohant@gmail.com',
      to: result.rows.map(row => row.email),  // Send to all matching vehicle owners
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

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Emails sent successfully to vehicle owners.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Controller to register a new vehicle call
exports.registerVehicleCall = async (req, res) => {
  const { location, district, count, vehicle_type, map_link, contact_number } = req.body;

  // Check for missing fields
  if (!location || !district || !count || !vehicle_type || !contact_number) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const result = await db.query(
      `INSERT INTO vehicle_calls (location, district, count, vehicle_type, map_link, contact_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [location, district, count, vehicle_type, map_link, contact_number]
    );

    const vehicleCall = result.rows[0];

    // Send emails to matching vehicle owners
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
