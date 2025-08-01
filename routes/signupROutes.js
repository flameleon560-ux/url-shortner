const express = require('express');
const { addUser } = require('../controller/signupController');
const router = express.Router();

router.post('/createuser', addUser);

module.exports = router;
