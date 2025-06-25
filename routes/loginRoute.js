const express = require('express')
const jwt = require('jsonwebtoken')
const dbImport = require('./dbConnection')

const router = express.Router()

const db = dbImport.db

const accessTokenSecret = 'youraccesstokensecret';


router.get('/', (req, res) => {
    const token = req.cookies.token;
    if(token){
        const decoded = jwt.verify(token, accessTokenSecret)
        res.json({ username: decoded.username, role: decoded.role })
    }else{
        res.json('nista')
    }
})

router.post('/', (req, res) => {

    const { username, password } = req.body

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, data) => {
        if(data.length > 0){

            if(data[0].password === password){
                const token = jwt.sign({ username: data[0].username,  role: data[0].role }, accessTokenSecret, { expiresIn: '1h' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, // true in production
                    sameSite: 'None', // 'none' for cross-site in prod
                    maxAge: 3600000,
                    // domain: '.yourdomain.com', // optionally set if using subdomains
                });
                res.json({ login: true });
            }else {
                res.json('kriva sifra')
            }

        }else{
            res.json('krivi username')
            console.log(err)
        }
    })
    
    // if(password === req.body.password){

    //     const token = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret, { expiresIn: '1h' });
        
    //     res.cookie('token', token, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === 'production',
    //         sameSite: 'strict',
    //         maxAge: 3600000
    //     });

    //      res.json({ login: true });

    // }else{
    //     res.json('kriva sifra')
    // }
})

module.exports = router