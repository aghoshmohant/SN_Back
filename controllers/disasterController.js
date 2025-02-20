const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/disaster');  // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  },
});

const upload = multer({ storage });

// Controller to register a disaster
exports.registerDisasters = async (req, res) => {
  const { disaster_type, affected_area, dob, district, created_by } = req.body;
  const imageFile = req.file;

  // Basic input validation
  if (!disaster_type || !affected_area || !dob || !district || !imageFile || !created_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Construct the public URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/disaster/${imageFile.filename}`;

    // Insert the new disaster into the database
    const result = await db.query(
      `INSERT INTO disaster (disaster_type, affected_area, dob, district, image, created_by, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING id`,
      [disaster_type, affected_area, dob, district, imageUrl, created_by]
    );

    return res.status(201).json({
      message: 'Disaster registered successfully!',
      disasterId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error during disaster registration:', error);
    return res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};

// Controller to fetch all unverified disasters
exports.getDisasters = async (req, res) => {

  const { verified } = req.query;
  const isVerified = verified === 'true'
  try {
    const result = await db.query('SELECT * FROM disaster WHERE is_verified = $1',[isVerified]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No disasters found' });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching disasters:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch disasters' });
  }
};

// Controller to approve a disaster (set is_verified to true)
exports.approveDisaster = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE disaster SET is_verified = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    return res.status(200).json({ message: 'Disaster approved successfully!' });
  } catch (error) {
    console.error('Error approving disaster:', error);
    return res.status(500).json({ error: 'Failed to approve disaster' });
  }
};

// Controller to reject a disaster (delete it from the database)
exports.rejectDisaster = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM disaster WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    return res.status(200).json({ message: 'Disaster rejected successfully!' });
  } catch (error) {
    console.error('Error rejecting disaster:', error);
    return res.status(500).json({ error: 'Failed to reject disaster' });
  }
};

// Export multer middleware to use in the routes
exports.upload = upload.single('image');  // Expect a single file with the field name "image"
