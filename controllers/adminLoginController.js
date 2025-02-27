const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // PostgreSQL database connection
require('dotenv').config();

const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const admin = result.rows[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { adminLogin };
