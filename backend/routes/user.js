const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const userValidator = require('../middleware/userValidator')
const limiter = require('../middleware/rateLimit')

router.post('/signup', userValidator, userCtrl.signup);
router.post('/login', limiter.loginLimiter, userCtrl.login);

module.exports = router;