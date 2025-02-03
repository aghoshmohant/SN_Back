const db = require('../config/db');  // Ensure this is the correct path to the db config

exports.getDonors = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT full_name, blood_group, district, phone_number FROM signUp WHERE donate_blood = true'
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