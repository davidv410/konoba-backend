const express = require('express')
const router = express.Router()
const dbImport = require('../routes/dbConnection')
const nodemailer = require('nodemailer')

const db = dbImport.db

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {rejectUnauthorized: false}
})

// const mailStructure = {
//     from: '',
//     to: '',
//     subject: '',
//     text: '',
// }

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

router.post('/', (req, res) => {
    const { name, email, phone, date, time, people } = req.body

    const VALUES = [
        name,
        email,
        phone,
        date,
        time,
        people
    ]

    const query = 
    `INSERT INTO pending_book_a_table (name, email, phone, date, time, people)
     VALUES (?, ?, ?, ?, ?, ?)`
    ;
    
    db.query(query, VALUES, (err, data) => {
        if(err){
            console.error('Error:', err);
            return res.status(500).json({ error: 'Database error' })
        }

        if(data){
            bookingNotification(email, 'konobaivinaarka@gmail.com')
            return res.json({ message: 'Mail sent' })
        }
    })

})


module.exports = router