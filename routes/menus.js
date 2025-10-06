const express = require('express')
const pool = require('./dbConnection')

const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const [data] = await pool.execute("SELECT * FROM menus")
        res.json(data)
    }catch(err){
        console.error('Error fetching menus:', err)
        res.status(500).json({ error: 'Failed to fetch menus' })
    }
})

module.exports = router