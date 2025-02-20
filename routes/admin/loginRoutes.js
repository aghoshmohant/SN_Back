const express = require('express');
const { login } = require('../../controllers/adminLoginController');
const router = express.Router();


router.get('/',(req,res)=>{
    res.send('login admin')
})
router.post('/login', login);


module.exports = router;