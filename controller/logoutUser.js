const jwt = require('jsonwebtoken')

const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(0), 
    });
    return res.json({ message: 'Logged out successfully' });
}

module.exports = logoutUser