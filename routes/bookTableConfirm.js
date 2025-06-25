const express = require('express')
const dbImport = require('./dbConnection')
const nodemailer = require('nodemailer')

const router = express.Router()
const db = dbImport.db

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {rejectUnauthorized: false}
})

const mailStructure = {
    from: '',
    to: '',
    subject: '',
    text: '',
}

const notifyUser = (name, email, phone, date, time, people, bookingState) => {

    let mailStructure
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let dateFormat = new Date(date).toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(":");
    let timeFormat =`${hours}:${minutes}`

    if(bookingState === true) {

        mailStructure = {
            from: 'KONOBA IVINA ARKA',
            to: email,
            subject: 'REZERVACIJA',
            text: `Postovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat} za ${people}, je uspjesna. Vidimo se!` // FORMATIRAT DATUM I VRIJEME
        }

    } else if (bookingState === false) {

        mailStructure = {
            from: 'KONOBA IVINA ARKA',
            to: email, //OVO PROMJENUT
            subject: 'REZERVACIJA',
            text: `Postovani ${name}. Vaša rezervacija ${dateFormat} u ${timeFormat} ,nazalost nije uspjesna.` 
        // FORMATIRAT DATUM I VRIJEME
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

router.get('/', (req, res) => {
    db.query("SELECT * FROM pending_book_a_table", (err, data) => {
        res.json(data)
    })
})

router.post('/', (req, res) => {
    const { id, decision } = req.body

    db.query("SELECT * FROM pending_book_a_table WHERE id = ?", [id], (err, data) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Database error');
        }

        if(decision === 'insert'){
            const query = `INSERT INTO book_a_table (name, email, phone, date, time, people) VALUES (?, ?, ?, ?, ?, ?)`
            const VALUES = [data[0].name, data[0].email, data[0].phone, data[0].date, data[0].time, data[0].people]
    
            db.query(query, VALUES, (err, data2) => {
                if (err) {
                    console.error('Error:', err);
                    return res.status(500).send('Insert data error');
                }

                console.log('Added to book a table');
                notifyUser(data[0].name, data[0].email, data[0].phone, data[0].date, data[0].time, data[0].people, true);

                db.query("DELETE FROM pending_book_a_table WHERE id = ?", [id], (err) => {
                    if (err) {
                        console.error('Error:', err);
                        return res.status(500).send('Record removal failed');
                    }

                    res.json({ msg: 'User added and email sent', user: id });
                });
            })
        }else if(decision === 'delete'){

            db.query("DELETE FROM pending_book_a_table WHERE id = ?", [id], (err) => {
                if (err) {
                    console.error('Error:', err);
                    return res.status(500).send('Record removal failed');
                }

                notifyUser(data[0].name, data[0].email, '', data[0].date, data[0].time, '', false); // OVDE DODAT PARAMETRE
                res.json({ msg: 'User removed from pending', user: id });
            });
        } else {
            res.status(400).send('Invalid decision');
        }
    })
})

module.exports = router