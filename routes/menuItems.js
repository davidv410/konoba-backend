const express = require('express')
const dbImport = require('./dbConnection')

const router = express.Router()
const db = dbImport.db

router.get('/', (req, res) => {

    const query = `SELECT menu_items.id, menu_items.name, menu_items.price, menu_items.description, menu_items.menu_id, menu_items.subgroup_id
        FROM menu_items
        LEFT JOIN subgroups ON menu_items.subgroup_id = subgroups.id
        ORDER BY subgroups.id
       `
    
    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        
        res.json(data);
           
    })
})

module.exports = router