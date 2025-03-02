const pool = require('../config/db'); // Import database connection

// Fetch volunteer ID and role using user ID
const getVolunteerIdByUser = async (req, res) => {
  const { userId } = req.params; // Extract user ID from request params

  try {
    const query = 'SELECT id, role FROM volunteer WHERE created_by = $1';
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No volunteer ID found for this user' });
    }

    console.log('Fetched Volunteers:', rows); // Debugging log to check response
    res.json(rows); // Returns [{ id: 2, role: "Logistics Volunteer" }, ...]
  } catch (error) {
    console.error('Error fetching volunteer ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getVolunteerIdByUser };
