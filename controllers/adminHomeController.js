const pool = require('../config/db');

const getHome = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM authority WHERE verified = true");
        console.lacog("Fetched authorities:", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
module.exports = {
 getHome,
  };
