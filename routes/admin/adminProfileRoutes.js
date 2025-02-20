const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const query = `SELECT id, name FROM admin `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Error fetching admin profile' });
  }
});

router.put('/update-password', async (req, res) => {
  const { id, newPassword } = req.body;

  if (!id || !newPassword) {
    return res.status(400).json({ message: 'ID and new password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); 
    await pool.query('UPDATE admin SET password = $1 WHERE id = $2', [hashedPassword, id]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
});

module.exports = router;

