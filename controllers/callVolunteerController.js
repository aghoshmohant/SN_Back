const db = require('../config/db');
const nodemailer = require('nodemailer');

const sendEmailToVolunteers = async (volunteerCall) => {
  try {
    const { role, location, district, count, map_link, contact_number } = volunteerCall;

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
          <a href="https://tinyurl.com/45afzcrw" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif;">Go to Home Page</a>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Emails sent successfully to volunteers.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.registerVolunteerCall = async (req, res) => {
  const { location, district, count, role, map_link, contact_number } = req.body;

  if (!location || !district || !count || !role || !contact_number) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const result = await db.query(
      `INSERT INTO volunteer_calls (location, district, count, role, map_link, contact_number, remaining_volunteers)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [location, district, count, role, map_link, contact_number, count]
    );

    const volunteerCall = result.rows[0];
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

exports.acceptVolunteerCall = async (req, res) => {
  const { callId, volunteerId, role, userId } = req.body;

  console.log('Received request to accept volunteer call:', { callId, volunteerId, role, userId });

  if (!callId || !volunteerId || !role || !userId) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'All fields (callId, volunteerId, role, userId) are required' });
  }

  try {
    const callResult = await db.query(
      'SELECT remaining_volunteers FROM volunteer_calls WHERE id = $1',
      [callId]
    );

    if (callResult.rows.length === 0) {
      console.log(`Volunteer call with ID ${callId} not found`);
      return res.status(404).json({ error: `Volunteer call with ID ${callId} not found` });
    }

    const remainingVolunteers = callResult.rows[0].remaining_volunteers;
    if (remainingVolunteers <= 0) {
      console.log(`No slots remaining for call ID ${callId}`);
      return res.status(400).json({ error: 'No slots remaining for this call' });
    }

    const existingAcceptance = await db.query(
      'SELECT * FROM accepted_volunteers WHERE call_id = $1 AND volunteer_id = $2',
      [callId, volunteerId]
    );

    if (existingAcceptance.rows.length > 0) {
      console.log(`Volunteer ${volunteerId} has already accepted call ${callId}`);
      return res.status(400).json({ error: 'You have already accepted this call' });
    }

    await db.query(
      `INSERT INTO accepted_volunteers (call_id, volunteer_id, role, user_id, accepted_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [callId, volunteerId, role, userId]
    );

    await db.query(
      'UPDATE volunteer_calls SET remaining_volunteers = remaining_volunteers - 1 WHERE id = $1',
      [callId]
    );

    console.log(`Volunteer call ${callId} accepted by volunteer ${volunteerId}`);
    res.status(201).json({ message: 'Volunteer call accepted successfully' });
  } catch (error) {
    console.error('Error accepting volunteer call:', error);
    res.status(500).json({ error: 'Failed to accept volunteer call: ' + error.message });
  }
};

exports.getAcceptedCalls = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.query(
      'SELECT call_id FROM accepted_volunteers WHERE user_id = $1',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching accepted calls:', error);
    res.status(500).json({ error: 'Failed to fetch accepted calls' });
  }
};
