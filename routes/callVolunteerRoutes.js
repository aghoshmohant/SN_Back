const express = require('express');
const { 
  registerVolunteerCall, 
  getVolunteerCalls, 
} = require('../controllers/callVolunteerController');

const router = express.Router();

// Route to register a volunteer call
router.post('/', registerVolunteerCall);

// Route to get all volunteer calls
router.get('/', getVolunteerCalls);


module.exports = router;
