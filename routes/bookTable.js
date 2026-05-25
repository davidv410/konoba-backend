const express = require('express')
const router = express.Router()
const BookTableModel = require('../models/BookTableModel')
const emailService = require('../utils/emailService')
const limiter = require('../middleware/rateLimit')

router.post('/', limiter, async (req, res, next) => {
    const { name, email, phone, date, time, people } = req.body
    try {
        const data = await BookTableModel.insertPending(name, email, phone, date, time, people)
        await emailService.bookingConfirmationNotification(email, 'konobaivinaarka@gmail.com')
        res.json({ message: 'Mail sent', data })
    } catch (err) {
        next(err)
    }
})

module.exports = router