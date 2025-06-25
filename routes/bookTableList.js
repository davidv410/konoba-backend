const express = require('express')
const dbImport = require('./dbConnection')

const router = express.Router()
const db = dbImport.db

router.get('/', (req, res) => {
    db.query("SELECT * FROM book_a_table", (err, data) => {
        res.json(data)
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM book_a_table WHERE id = ?", [id], (err, data) => {
        res.json(data)
    })
})

module.exports = router