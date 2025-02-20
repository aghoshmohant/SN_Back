const db = require('../config/db');
const nodemailer = require('nodemailer');

// Function to send emails
const sendEmailToVolunteers = async (volunteerCall) => {
  try {
    const { role, location, district, count, map_link, contact_number } = volunteerCall;

    // Query to get emails of verified volunteers with the matching role
    const result = await db.query(
      `SELECT users.email FROM users
       INNER JOIN volunteer ON users.id = volunteer.created_by
       WHERE volunteer.role = $1 AND volunteer.is_verified = true`,
      [role]
    );

    if (result.rows.length === 0) {
      console.log('No verified volunteers found for the specified role.');
      return;
    }

    // Email configuration using nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,

      auth: {
        user: 'aghoshmohant@gmail.com',  // Replace with your email
        pass: 'dpwcyaboxthbdihf',  // Replace with your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: 'aghoshmohant@gmail.com',  // Replace with your email
      to: result.rows.map(row => row.email),
      subject: `Volunteer Call for Role: ${role}`,
      html: `
        <p>Dear Volunteer,</p>
        <p>A new volunteer call has been registered:</p>
        <ul>
          <li>Role: ${role}</li>
          <li>Location: ${location}</li>
          <li>District: ${district}</li>
          <li>Count: ${count}</li>
          <li>Contact Number: ${contact_number}</li>
          <li><a href="${map_link}" target="_blank">View Map</a></li>
        </ul>
        <p>If you are available, please click the button below to accept:</p>
        <a href="www.youtube.com" style="padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none;">Accept Volunteer Call</a>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Emails sent successfully to volunteers.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Controller to register a volunteer call
exports.registerVolunteerCall = async (req, res) => {
  const { location, district, count, role, map_link, contact_number } = req.body;

  if (!location || !district || !count || !role || !contact_number) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const result = await db.query(
      `INSERT INTO volunteer_calls (location, district, count, role, map_link, contact_number)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [location, district, count, role, map_link, contact_number]
    );

    const volunteerCall = result.rows[0];

    // Send emails to the appropriate volunteers
    await sendEmailToVolunteers(volunteerCall);

    res.status(201).json({
      message: 'Volunteer call registered successfully!',
      volunteerCallId: volunteerCall.id,
    });
  } catch (error) {
    console.error('Error during volunteer call registration:', error);
    res.status(500).json({ error: 'Something went wrong while registering the volunteer call.' });
  }
};

// Controller to fetch all volunteer calls
exports.getVolunteerCalls = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM volunteer_calls');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No volunteer calls found' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching volunteer calls:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer calls' });
  }
};
