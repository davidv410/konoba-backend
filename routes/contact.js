const express = require('express')
const router = express.Router()
const emailService = require('../utils/emailService')

router.post('/', async (req, res, next) => {
    try{
        const { name, email, phone, message } = req.body
        await emailService.sendContactEmail(name,email,phone,message)
        res.json({ msg: 'Contact email sent'});
    }catch(err){
        next(err)
    }

})

module.exports = router