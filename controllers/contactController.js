const db = require('../config/db');

// Fetch all contacts (with optional search)
const getContacts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM contacts';
    let params = [];

    if (search) {
      query += ' WHERE name ILIKE $1';
      params.push(`%${search}%`);
    }

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new contact
const addContact = async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO contacts (name, number) VALUES ($1, $2) RETURNING *',
      [name, number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding contact:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  try {
    const result = await db.query(
      'UPDATE contacts SET name = $1, number = $2 WHERE id = $3 RETURNING *',
      [name, number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a contact
const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
};