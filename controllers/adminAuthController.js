const pool = require("../config/db");

// Fetch Authority Details by ID
const getAuthorityDetails = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid authority ID" });
    }

    try {
        const query = "SELECT * FROM district_heads WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Authority not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching authority details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Authority by ID
const deleteAuthority = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid authority ID" });
    }

    try {
        const deleteQuery = "DELETE FROM district_heads WHERE id = $1 RETURNING *";
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Authority not found" });
        }

        res.status(200).json({ message: "Authority deleted successfully" });
    } catch (error) {
        console.error("Error deleting authority:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAuthorityDetails,
    deleteAuthority
};
