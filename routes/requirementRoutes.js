const express = require('express');
const { getRequirements, addRequirement, deleteRequirement, updateRequirementQuantity } = require('../controllers/requirementController');
const router = express.Router();

router.get('/requirements', getRequirements);
router.post('/requirements', addRequirement);
router.delete('/requirements/:id', deleteRequirement); // DELETE endpoint
router.put('/requirements/:id', updateRequirementQuantity); // Added PUT endpoint for updating quantity

module.exports = router;
