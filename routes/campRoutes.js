const express = require('express');
const { getCamps, addCamp, deleteCamp, updateCampPeople } = require('../controllers/campController');

const router = express.Router();

// Route to get all camps
router.get('/camps', getCamps);

// Route to add a new camp
router.post('/camps', addCamp);

// Route to delete a camp
router.delete('/camps/:id', deleteCamp);

// Route to update current people in a camp
router.put('/camps/:id/people', updateCampPeople);

module.exports = router;
