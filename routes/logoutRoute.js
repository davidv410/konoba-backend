const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(0), 
    });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router