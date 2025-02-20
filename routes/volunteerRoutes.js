const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// Route to register a new volunteer
router.post('/register', volunteerController.upload, volunteerController.registerVolunteer);

// Route to fetch all volunteers
router.get('/list', volunteerController.getVolunteers);

// Route to approve a volunteer
router.put('/approve/:id', volunteerController.approveVolunteer);

// Route to reject a volunteer
router.delete('/reject/:id', volunteerController.rejectVolunteer);

module.exports = router;
