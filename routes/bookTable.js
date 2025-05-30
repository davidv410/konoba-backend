const express = require('express')
const router = express.Router()
const dbImport = require('../routes/dbConnection')

const db = dbImport.db

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
        return res.status(201).json({ message: 'Reservation saved' })
    })

})


module.exports = router