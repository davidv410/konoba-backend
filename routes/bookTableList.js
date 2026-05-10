const express = require('express')
const BookTableModel = require('../models/BookTableModel')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try{
        const data = await BookTableModel.getBookedData()
        res.json(data)
    }catch(err){
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try{
        const data = await BookTableModel.deleteBookedData(id)
        res.json({ message: 'Booking removed', data });
    }catch(err){
        next(err)
    }
})

module.exports = router