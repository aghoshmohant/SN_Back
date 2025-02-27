const pool = require("../config/db");

// Fetch verified authorities
const getVerifiedAuthorities = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name AS name, email, phone_number, district, 
              id_proof, profile_photo, designation, department, 
              employee_id, office_address 
       FROM district_heads 
       WHERE is_verified = true`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching verified authorities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getVerifiedAuthorities };