const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

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

const sendEmail = (name,email,phone,message) => {
    const mailStructure = { 
        from: email,
        to: process.env.EMAIL, 
        subject: `KONTAKT`,
        text: `${name} (${email} - ${phone})
${message}` 
    }
    transporter.sendMail(mailStructure, (err, data) => {
        if(err){
            console.log(err)
            return res.status(500).send('Failed to send email');
        }

        if(data){
            return console.log('EMAIL POSLAN')
        }

        console.error('Nesto crklo');
        res.status(500).send('Nesto crklo');
    })
}

router.post('/', (req, res) => {
    const { name, email, phone, message } = req.body
    sendEmail(name,email,phone,message)
    res.json({ msg: 'Contact email sent'});

})

module.exports = router