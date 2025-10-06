const express = require('express')
const jwt = require('jsonwebtoken')
const pool = require('./dbConnection')

const router = express.Router()

const accessTokenSecret = 'youraccesstokensecret'; //<--- LOOOOL

router.get('/', (req, res) => {
    const token = req.cookies.token;
    if(token){
        try {
            const decoded = jwt.verify(token, accessTokenSecret)
            res.json({ username: decoded.username, role: decoded.role })
        } catch (error) {
            console.error('Invalid token:', error)
            res.status(401).json({ error: 'Invalid token' })
        }
    } else {
        res.json('nista')
    }
})

router.post('/', async (req, res) => {
    const { username, password } = req.body

    try {
        const [data] = await pool.execute("SELECT * FROM users WHERE username = ?", [username])
        
        if(data.length > 0){
            if(data[0].password === password){
                const token = jwt.sign({ 
                    username: data[0].username,  
                    role: data[0].role 
                }, accessTokenSecret, { expiresIn: '1h' });
                
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, 
                    sameSite: 'None', 
                    maxAge: 3600000
                });
                res.json({ login: true });
            } else {
                res.status(401).json({ error: 'kriva sifra' })
            }
        } else {
            res.status(401).json({ error: 'krivi username' })
        }
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ error: 'Database error' })
    }
})

module.exports = router