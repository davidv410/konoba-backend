const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router