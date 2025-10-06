const express = require('express')
const pool = require('./dbConnection')
const nodemailer = require('nodemailer')

const router = express.Router()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {rejectUnauthorized: false}
})

const notifyUser = (name, email, phone, date, time, people, bookingState) => {
    let mailStructure
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let dateFormat = new Date(date).toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(":");
    let timeFormat = `${hours}:${minutes}`

    if(bookingState === true) {
        mailStructure = {
            from: 'KONOBA IVINA ARKA',
            to: email,
            subject: 'REZERVACIJA',
            text: `Postovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat} za ${people}, je uspjesna. Vidimo se!`
        }
    } else if (bookingState === false) {
        mailStructure = {
            from: 'KONOBA IVINA ARKA',
            to: email,
            subject: 'REZERVACIJA',
            text: `Postovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat} ,nazalost nije uspjesna.`
        }
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

router.get('/', async (req, res) => {
    try {
        const [data] = await pool.execute("SELECT * FROM pending_book_a_table")
        res.json(data)
    } catch (err) {
        console.error('Error fetching pending bookings:', err)
        res.status(500).json({ error: 'Failed to fetch pending bookings' })
    }
})

router.post('/', async (req, res) => {
    const { id, decision } = req.body

    try {
        const [data] = await pool.execute("SELECT * FROM pending_book_a_table WHERE id = ?", [id])
        
        if (data.length === 0) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        if(decision === 'insert'){
            const query = `INSERT INTO book_a_table (name, email, phone, date, time, people) VALUES (?, ?, ?, ?, ?, ?)`
            const VALUES = [data[0].name, data[0].email, data[0].phone, data[0].date, data[0].time, data[0].people]
    
            await pool.execute(query, VALUES)
            console.log('Added to book a table');
            notifyUser(data[0].name, data[0].email, data[0].phone, data[0].date, data[0].time, data[0].people, true);

            await pool.execute("DELETE FROM pending_book_a_table WHERE id = ?", [id])
            res.json({ msg: 'User added and email sent', user: id });

        } else if(decision === 'delete'){
            await pool.execute("DELETE FROM pending_book_a_table WHERE id = ?", [id])
            notifyUser(data[0].name, data[0].email, '', data[0].date, data[0].time, '', false);
            res.json({ msg: 'User removed from pending', user: id });
            
        } else {
            res.status(400).json({ error: 'Invalid decision' });
        }
    } catch (err) {
        console.error('Error processing booking:', err)
        res.status(500).json({ error: 'Failed to process booking' })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [data] = await pool.execute("DELETE FROM pending_book_a_table WHERE id = ?", [id])
        
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' })
        }
        
        res.json({ message: 'Booking deleted successfully', data })
    } catch (err) {
        console.error('Error deleting booking:', err)
        res.status(500).json({ error: 'Failed to delete booking' })
    }
})

module.exports = router