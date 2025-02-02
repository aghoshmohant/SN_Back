const db = require('../config/db');

// Register Organization Controller
exports.registerOrg = async (req, res) => {
  const { org_name, phone_number, email, district } = req.body;

  // Basic input validation
  if (!org_name || !phone_number || !email || !district) {
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
    // Insert into the correct table (organizations)
    const result = await db.query(
      `INSERT INTO organizations (org_name, phone_number, email, district)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [org_name, phone_number, email, district]
    );

    return res.status(201).json({ 
      message: 'Organization registered successfully!', 
      orgId: result.rows[0].id 
    });

  } catch (error) {
    console.error('Error during organization registration:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};
