const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sentOTP', authController.sendOTP);

module.exports = router;
