const db = require('../config/db');

// Fetch all blood banks (with optional search)
const getBloodBanks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM blood_banks';
    let params = [];

    if (search) {
      query += ' WHERE name ILIKE $1 OR district ILIKE $1';
      params.push(`%${search}%`);
    }

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching blood banks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new blood bank
const addBloodBank = async (req, res) => {
  const { name, district, number } = req.body;

  if (!name || !district || !number) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO blood_banks (name, district, number) VALUES ($1, $2, $3) RETURNING *',
      [name, district, number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding blood bank:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a blood bank
const updateBloodBank = async (req, res) => {
  const { id } = req.params;
  const { name, district, number } = req.body;

  if (!name || !district || !number) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'UPDATE blood_banks SET name = $1, district = $2, number = $3 WHERE id = $4 RETURNING *',
      [name, district, number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blood bank not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating blood bank:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a blood bank
const deleteBloodBank = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM blood_banks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blood bank not found' });
    }

    res.status(200).json({ message: 'Blood bank deleted successfully' });
  } catch (err) {
    console.error('Error deleting blood bank:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getBloodBanks,
  addBloodBank,
  updateBloodBank,
  deleteBloodBank,
};