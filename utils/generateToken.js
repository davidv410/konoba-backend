const jwt = require('jsonwebtoken')

const generateToken = (username, role) => {
    return jwt.sign({ 
        username: username,  
        role: role 
    }, process.env.ACCESSTOKEN, { expiresIn: '1h' });
}

module.exports = generateToken