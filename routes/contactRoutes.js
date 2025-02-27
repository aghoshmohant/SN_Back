const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

// Define routes
router.get('/contacts', contactController.getContacts); // Fetch all contacts
router.post('/contacts', contactController.addContact); // Add a new contact
router.put('/contacts/:id', contactController.updateContact); // Update a contact
router.delete('/contacts/:id', contactController.deleteContact); // Delete a contact

module.exports = router;