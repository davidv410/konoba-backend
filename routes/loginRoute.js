const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const loginUser = require('../controller/loginUser')

router.post('/', loginUser)

module.exports = router