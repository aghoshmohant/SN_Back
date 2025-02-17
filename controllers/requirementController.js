const pool = require('../config/db'); // Import database connection

// Get all requirements
const getRequirements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requirements');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ error: 'Server error while fetching requirements' });
  }
};

// Add new requirement
const addRequirement = async (req, res) => {
  const { item_name, quantity, category, camp_name, city, district, map_link, phone_number } = req.body;
  try {
    await pool.query(
      'INSERT INTO requirements (item_name, quantity, category, camp_name, city, district, map_link, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [item_name, quantity, category, camp_name, city, district, map_link, phone_number]
    );
    res.status(201).json({ message: 'Requirement added successfully' });
  } catch (error) {
    console.error('Error adding requirement:', error);
    res.status(500).json({ error: 'Server error while adding requirement' });
  }
};

// Update requirement quantity
const updateRequirementQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    await pool.query('UPDATE requirements SET quantity = $1 WHERE id = $2', [quantity, id]);
    res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Server error while updating quantity' });
  }
};

// Delete a requirement by ID
const deleteRequirement = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM requirements WHERE id = $1', [id]);
    res.status(200).json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    console.error('Error deleting requirement:', error);
    res.status(500).json({ error: 'Server error while deleting requirement' });
  }
};

module.exports = { getRequirements, addRequirement, updateRequirementQuantity, deleteRequirement };
