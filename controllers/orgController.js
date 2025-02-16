const db = require('../config/db');

// Controller to register an organization
exports.registerOrg = async (req, res) => {
  const { org_name, phone_number, email, district, created_by, social_media_link } = req.body;

  if (!org_name || !phone_number || !email || !district || !created_by || !social_media_link) {
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
      `INSERT INTO organizations (org_name, phone_number, email, district, created_by, social_media_link, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING id`,
      [org_name, phone_number, email, district, created_by, social_media_link]
    );

    return res.status(201).json({
      message: 'Organization registered successfully!',
      orgId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error during organization registration:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Controller to approve an organization
exports.approveOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE organizations SET is_verified = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.status(200).json({ message: 'Organization approved successfully' });
  } catch (error) {
    console.error('Error approving organization:', error);
    return res.status(500).json({ error: 'Failed to approve organization' });
  }
};

// Controller to reject an organization
exports.rejectOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM organizations WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.status(200).json({ message: 'Organization rejected successfully' });
  } catch (error) {
    console.error('Error rejecting organization:', error);
    return res.status(500).json({ error: 'Failed to reject organization' });
  }
};

// Controller to fetch organizations
exports.getOrganizations = async (req, res) => {
  const { verified } = req.query;
  const isVerified = verified === 'true';

  try {
    const result = await db.query(
      'SELECT id, org_name, phone_number, email, district, social_media_link, is_verified FROM organizations WHERE is_verified = $1',
      [isVerified]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No organizations found' });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};
