const express = require('express')
const pool = require('./dbConnection')

const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const [data] = await pool.execute("SELECT * FROM book_a_table")
         res.json(data)
    }catch(err){
        console.error('Error fetching booking:', err)
        res.status(500).json({ error: 'Failed to fetch booking' })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const [data] = await pool.execute("DELETE FROM book_a_table WHERE id = ?", [id])
        res.json({ message: 'Booking removed', data });
    }catch(err){
        console.error('Error too delete booking:', err)
        res.status(500).json({ error: 'Error too delete booking' })
    }
})

module.exports = router