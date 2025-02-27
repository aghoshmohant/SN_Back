const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get profile
exports.getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await db.query("SELECT * FROM district_heads WHERE email = $1", [decoded.email]);

    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const { password, ...profile } = user.rows[0];
    res.status(200).json(profile);
  } catch (error) {
    res.status(401).json({ error: "Invalid token or server error" });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { full_name, phone_number, district, designation, department, employee_id, office_address } = req.body;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await db.query("SELECT * FROM district_heads WHERE email = $1", [decoded.email]);

    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    await db.query(
      `UPDATE district_heads 
       SET full_name = $1, phone_number = $2, district = $3, designation = $4, department = $5, employee_id = $6, office_address = $7, updated_at = NOW()
       WHERE email = $8`,
      [full_name, phone_number, district, designation, department, employee_id, office_address, decoded.email]
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { old_password, new_password } = req.body;

  if (!token) return res.status(401).json({ error: "No token provided" });
  if (!old_password || !new_password) return res.status(400).json({ error: "Old and new passwords are required" });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await db.query("SELECT * FROM district_heads WHERE email = $1", [decoded.email]);

    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(old_password, user.rows[0].password);
    if (!isPasswordValid) return res.status(401).json({ error: "Incorrect old password" });

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    await db.query("UPDATE district_heads SET password = $1, updated_at = NOW() WHERE email = $2", [
      hashedNewPassword,
      decoded.email,
    ]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

module.exports = exports;