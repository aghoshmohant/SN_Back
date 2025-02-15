const db = require('../config/db'); // Database connection

// Function to fetch the user's full name, ID, and email
exports.getHomePage = async (req, res) => {
  try {
    const userEmail = req.user?.email; // Ensure req.user is available
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Query the database for the user's ID, full name, and email
    const result = await db.query('SELECT id, full_name, email FROM users WHERE email = $1', [userEmail]);

    console.log('Database query result:', result.rows); // Log the result for debugging

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { id, full_name, email } = result.rows[0]; // Extract the user's details
    return res.status(200).json({ id, full_name, email });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
