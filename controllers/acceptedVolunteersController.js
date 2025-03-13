const db = require('../config/db');

const getAcceptedVolunteers = async (req, res) => {
  try {
    const query = `
      SELECT 
        av.id,
        av.call_id,
        av.volunteer_id,
        av.role,
        av.user_id,
        u.full_name,
        u.email,
        u.phone_number
      FROM accepted_volunteers av
      LEFT JOIN users u ON av.user_id = u.id
      ORDER BY av.id
    `;
    
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching accepted volunteers:', {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Internal Server Error',
      code: err.code 
    });
  }
};

module.exports = { getAcceptedVolunteers };