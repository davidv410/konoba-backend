const express = require('express')
const pool = require('./dbConnection')

const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const [data] = await pool.execute("SELECT * FROM meat_type")
        res.json(data)
    }catch(err){
        console.error('Error fetching meat types:', err)
        res.status(500).json({ error: 'Failed to fetch meat types' })
    }
})

module.exports = router