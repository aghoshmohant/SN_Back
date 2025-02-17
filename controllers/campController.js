const pool = require('../config/db');

// Controller to get all camps
const getCamps = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM camps');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching camps:', error);
    res.status(500).json({ error: 'Failed to fetch camps' });
  }
};

// Controller to add a new camp
const addCamp = async (req, res) => {
  const { camp_name, city, district, max_capacity, current_people, map_link, contact_number } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO camps (camp_name, city, district, max_capacity, current_people, map_link, contact_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [camp_name, city, district, max_capacity, current_people, map_link, contact_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding camp:', error);
    res.status(500).json({ error: 'Failed to add camp' });
  }
};

// Controller to delete a camp
const deleteCamp = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM camps WHERE id = $1', [id]);
    res.status(200).json({ message: 'Camp deleted successfully' });
  } catch (error) {
    console.error('Error deleting camp:', error);
    res.status(500).json({ error: 'Failed to delete camp' });
  }
};

// Controller to update current people in a camp
const updateCampPeople = async (req, res) => {
  const { id } = req.params;
  const { current_people } = req.body;

  try {
    const result = await pool.query(
      'UPDATE camps SET current_people = $1 WHERE id = $2 RETURNING *',
      [current_people, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating camp:', error);
    res.status(500).json({ error: 'Failed to update camp' });
  }
};

module.exports = {
  getCamps,
  addCamp,
  deleteCamp,
  updateCampPeople
};
