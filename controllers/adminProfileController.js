const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // PostgreSQL database connection
require('dotenv').config();

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId = decoded.adminId;

        const result = await pool.query('SELECT * FROM admin WHERE id = $1', [adminId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Admin not found" });
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, admin.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE admin SET password = $1 WHERE id = $2', [hashedPassword, adminId]);

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Password update error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { updatePassword };
