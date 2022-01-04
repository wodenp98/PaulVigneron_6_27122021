const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const userValidator = require('../middleware/userValidator')

router.post('/signup', userValidator, userCtrl.signup);
router.post('/login', userValidator, userCtrl.login);

module.exports = router;