const express = require('express');
const { handleUserSignup, handleUserLogin } = require('../controller/signupController');
const router = express.Router();

router.post('/createuser', handleUserSignup);
router.post('/loginuser', handleUserLogin)

module.exports = router;
