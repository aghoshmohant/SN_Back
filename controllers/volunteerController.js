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

  // Basic input validation
  if (!role || !certificateFile || !created_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Construct the public URL for the uploaded certificate
    const certificateUrl = `${req.protocol}://${req.get('host')}/uploads/volunteer/${certificateFile.filename}`;

    // Insert the new volunteer into the database
    const result = await db.query(
      `INSERT INTO volunteer (role, certificate, created_by)
       VALUES ($1, $2, $3) RETURNING id`,
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
    // Join users and volunteer tables to get all relevant data
    const query = `
      SELECT 
        users.id, 
        users.full_name, 
        users.email, 
        users.phone_number, 
        users.blood_group, 
        users.district, 
        volunteer.role, 
        volunteer.certificate 
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

// Export multer middleware to use in the routes
exports.upload = upload.single('certificate'); // Expect a single file with the field name "certificate"
