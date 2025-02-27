const express = require('express');
const path = require('path'); 
const router = express.Router();
const pool = require('../config/db');
const { body } = require('express-validator');

router.use('/uploads', express.static(path.join(__dirname, '../../../uploads')));

router.get('/', async function (req, res) {
  try {
    const query = `SELECT id, name, email, phone_number, office_address, designation, department, employee_id, id_proof, photo 
                   FROM district_heads WHERE verified = false`;
    const { rows } = await pool.query(query);
    const updatedRows = rows.map((row) => ({
      ...row,
      id_proof: row.id_proof ? `/uploads/${row.id_proof}` : null,
      photo: row.photo ? `/uploads/${row.photo}` : null,
    }));

    res.json(updatedRows);
  } catch (error) {
    console.log('error fecthing data');
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
});

router.put('/', async (req, res) => {
  console.log("Received request body:", req.body);  

  const { id } = req.body;
  console.log();
  if (!id) {
    return res.status(400).json({ message: "Missing ID" });
  }
  try {
    await pool.query('UPDATE district_heads SET verified = true WHERE id = $1', [id]);
    res.status(200).json({ message: 'Approval successful' });
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({ message: 'Error updating verification status.' });
  }
});
router.delete('/autho-reject/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing ID" });
    }
    try {
      const result = await pool.query('DELETE FROM district_heads WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "No matching record found" });
      }

      res.status(200).json({ message: 'Authority rejected and removed successfully' });
    } catch (error) {
      console.error('Error deleting authority:', error);
      res.status(500).json({ message: 'Error removing authority.' });
    }
  });

  module.exports = router;