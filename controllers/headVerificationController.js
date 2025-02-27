const pool = require("../config/db");

// Fetch unverified district heads
const getUnverifiedDistrictHeads = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name AS name, email, phone_number, district, 
              id_proof, profile_photo, designation, department, 
              employee_id, office_address 
       FROM district_heads 
       WHERE is_verified = false`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching district heads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Approve district head (set is_verified = true)
const approveDistrictHead = async (req, res) => {
  const { id } = req.body;

  try {
    await pool.query(`UPDATE district_heads SET is_verified = true WHERE id = $1`, [id]);
    res.json({ message: "District head approved successfully" });
  } catch (error) {
    console.error("Error approving district head:", error);
    res.status(500).json({ error: "Error approving district head" });
  }
};

// Reject district head (delete from database)
const rejectDistrictHead = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM district_heads WHERE id = $1`, [id]);
    res.json({ message: "District head rejected successfully" });
  } catch (error) {
    console.error("Error rejecting district head:", error);
    res.status(500).json({ error: "Error rejecting district head" });
  }
};

module.exports = { getUnverifiedDistrictHeads, approveDistrictHead, rejectDistrictHead };