const express = require('express')
const BookTableModel = require('../models/BookTableModel')
const emailService = require('../utils/emailService')
const router = express.Router()

const notifyUser = async (name, email, phone, date, time, people, bookingState) => {
    if(bookingState === true) {
        await emailService.sendBookingConfirmation(name, email, phone, date, time, people)
        return
    }  
    if (bookingState === false) {
        await emailService.sendBookingRejection(name, email, phone, date, time, people)
        return
    }

}

router.get('/', async (req, res, next) => {
    try {
        const data = await BookTableModel.getBookingsData()
        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    const { id, decision } = req.body

    try {
        const data = await BookTableModel.getBookingData(id)
        
        if (data.length === 0) { return res.status(404).json({ error: 'Booking not found' }) }

        if(decision === 'insert'){
            const insert = await BookTableModel.insertBooking(data[0].name, data[0].email, data[0].phone, data[0].date, data[0].time, data[0].people)
            const deletePending = await BookTableModel.deletePending(id)
            notifyUser(data[0].name, data[0].email, data[0].phone, data[0].date, data[0].time, data[0].people, true);
            res.json({ msg: 'User added and email sent', user: id });
            return

        }

        if(decision === 'delete'){
            const deletePending = await BookTableModel.deletePending(id)
            notifyUser(data[0].name, data[0].email, '', data[0].date, data[0].time, '', false);
            res.json({ msg: 'User removed from pending', user: id });
            return
        }

        res.status(400).json({ error: 'Invalid decision' });

    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletePending = await BookTableModel.deletePending(id)
        if (deletePending.affectedRows === 0) { return res.status(404).json({ message: 'Booking not found' })}
        res.json({ message: 'Booking deleted successfully', deletePending })
    } catch (err) {
        next(err)
    }
})

module.exports = router