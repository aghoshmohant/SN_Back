const db = require('../config/db');  // Ensure this is the correct path to the db config

exports.getDonors = async (req, res) => {
  try {
    // Get the current date and subtract 18 years to calculate the minimum birthdate
    const today = new Date();
    const minBirthdate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().slice(0, 10);

    const result = await db.query(
      `SELECT full_name, blood_group, district, phone_number 
       FROM users 
       WHERE donate_blood = true AND dob <= $1`, 
      [minBirthdate] // Use the minimum birthdate as a parameter
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No donors found' });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch donors' });
  }
};
