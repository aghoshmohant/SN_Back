const pool = require('../config/db'); // Import database connection

// Get all requirements
const getRequirements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requirements'); // Fetch all data
    res.json(result.rows); // Send data as JSON response
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ error: 'Server error while fetching requirements' });
  }
};

module.exports = { getRequirements };
