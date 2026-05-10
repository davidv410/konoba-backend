const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const protect = require('../middleware/protect')
const getCurrentUser = require('../controller/getCurrentUser')

router.get('/', protect, getCurrentUser)

module.exports = router