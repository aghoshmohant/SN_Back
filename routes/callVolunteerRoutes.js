const express = require('express');
const { 
  registerVolunteerCall, 
  getVolunteerCalls, 
  acceptVolunteerCall,
  getAcceptedCalls
} = require('../controllers/callVolunteerController');

const router = express.Router();

// Route to register a volunteer call
router.post('/', registerVolunteerCall);

// Route to get all volunteer calls
router.get('/', getVolunteerCalls);

// Route to accept a volunteer call
router.post('/accept', acceptVolunteerCall);

// Route to get accepted calls for a user
router.get('/accepted-calls/:userId', getAcceptedCalls);

module.exports = router;