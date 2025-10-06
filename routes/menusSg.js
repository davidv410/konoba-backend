const express = require('express')
const pool = require('./dbConnection')
const router = express.Router()


router.get('/', async(req, res) => {
    try{
        const [data] = await pool.execute("SELECT * FROM subgroups")
        res.json(data)
    }catch(err){
        console.error('Error fetching menu subgroups:', err)
        res.status(500).json({ error: 'Failed to fetch menu subgroups' })
    }
})

module.exports = router