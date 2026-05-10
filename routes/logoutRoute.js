const express = require('express')
const logoutUser = require('../controller/logoutUser')
const router = express.Router()

router.post('/', logoutUser);

module.exports = router