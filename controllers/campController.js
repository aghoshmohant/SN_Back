const pool = require('../config/db'); // Import the database connection

// Controller to get all camps
const getCamps = async (req, res) => {
  try {
    // Query the camps table
    const result = await pool.query('SELECT * FROM camps');
    
    // Return the result as JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching camps:', error);
    res.status(500).json({ error: 'Failed to fetch camps' });
  }
};

module.exports = {
  getCamps,
};
