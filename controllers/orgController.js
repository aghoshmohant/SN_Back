const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Controller to register an organization
exports.registerOrg = async (req, res) => {
  const { org_name, phone_number, email, district,created_by, } = req.body;

  // Basic input validation
  if (!org_name || !phone_number || !email || !district || !created_by) {
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
    // Insert into the organizations table
    const result = await db.query(
      `INSERT INTO organizations (org_name, phone_number, email, district,created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [org_name, phone_number, email, district, created_by]
    );

    return res.status(201).json({
      message: 'Organization registered successfully!',
      orgId: result.rows[0].id, // Return the inserted organization's ID (optional)
    });
  } catch (error) {
    console.error('Error during organization registration:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Controller to fetch all organizations
exports.getOrganizations = async (req, res) => {
  try {
    // Fetch all organizations from the database
    const result = await db.query('SELECT * FROM organizations');

    // Check if organizations exist
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No organizations found' });
    }

    // Return the list of organizations
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};
