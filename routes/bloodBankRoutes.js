const express = require('express');
const bloodBankController = require('../controllers/bloodBankController');

const router = express.Router();

router.get('/blood-banks', bloodBankController.getBloodBanks);
router.post('/blood-banks', bloodBankController.addBloodBank);
router.put('/blood-banks/:id', bloodBankController.updateBloodBank);
router.delete('/blood-banks/:id', bloodBankController.deleteBloodBank);

module.exports = router;