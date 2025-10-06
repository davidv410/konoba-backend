const express = require('express')
const router = express.Router()
const pool = require('./dbConnection')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {rejectUnauthorized: false}
})

const bookingNotification = (email, konoba) => {
    let mailStructure = {
            from: email,
            to: konoba,
            subject: 'ZAHTJEV ZA REZERVACIJU',
            text: `Zahtjev za rezervaciju od ${email}, potvrdi/odbij u admin panelu, https://www.konobaivinaarka.com/admin-confirm` 
    }

    transporter.sendMail(mailStructure, (err, data) => {
        if(err){
            console.log(err)
        }

        if(data){
            return console.log('MAIL POSLAN')
        }
    })
}

router.post('/', async (req, res) => {
    const { name, email, phone, date, time, people } = req.body

    const VALUES = [name, email, phone, date, time, people]
    const query = `INSERT INTO pending_book_a_table (name, email, phone, date, time, people) VALUES (?, ?, ?, ?, ?, ?)`
    
    try {
        const [data] = await pool.execute(query, VALUES)
        
        bookingNotification(email, 'konobaivinaarka@gmail.com')
        res.json({ message: 'Mail sent', data })
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Database error' })
    }
})

module.exports = router