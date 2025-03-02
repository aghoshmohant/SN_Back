const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/volunteer'); // Save files to the "uploads/volunteer" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Register a new volunteer
exports.registerVolunteer = async (req, res) => {
  const { role, created_by } = req.body;
  const certificateFile = req.file;

  if (!role || !certificateFile || !created_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const certificateUrl = `${req.protocol}://${req.get('host')}/uploads/volunteer/${certificateFile.filename}`;

    const result = await db.query(
      `INSERT INTO volunteer (role, certificate, created_by, is_verified)
       VALUES ($1, $2, $3, false) RETURNING id`,
      [role, certificateUrl, created_by]
    );

    return res.status(201).json({
      message: 'Volunteer registered successfully!',
      volunteerId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error during volunteer registration:', error);
    return res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};

// Fetch all volunteers with user data
exports.getVolunteers = async (req, res) => {
  try {
    const query = `
      SELECT 
        users.id, 
        users.full_name, 
        users.email, 
        users.phone_number, 
        users.blood_group, 
        users.district, 
        volunteer.id AS volunteer_id,
        volunteer.role, 
        volunteer.certificate,
        volunteer.is_verified
      FROM users
      INNER JOIN volunteer ON users.id = volunteer.created_by
    `;
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No volunteers found' });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch volunteers' });
  }
};

// Approve a volunteer (set is_verified to true)
exports.approveVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE volunteer SET is_verified = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    return res.status(200).json({ message: 'Volunteer approved successfully!' });
  } catch (error) {
    console.error('Error approving volunteer:', error);
    return res.status(500).json({ error: 'Failed to approve volunteer' });
  }
};

// Reject a volunteer (delete from the database)
exports.rejectVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM volunteer WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    return res.status(200).json({ message: 'Volunteer rejected successfully!' });
  } catch (error) {
    console.error('Error rejecting volunteer:', error);
    return res.status(500).json({ error: 'Failed to reject volunteer' });
  }
};

exports.getVolunteerByUserId = async (req, res) => {
  const userId = req.user?.id || req.params.userId; // Assuming user ID comes from auth middleware or params

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await db.query(
      `SELECT id AS volunteer_id, role, is_verified 
       FROM volunteer 
       WHERE created_by = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No volunteer profile found for this user' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching volunteer by user ID:', error);
    return res.status(500).json({ error: 'Failed to fetch volunteer data' });
  }
};

// Export multer middleware to use in the routes
exports.upload = upload.single('certificate');
