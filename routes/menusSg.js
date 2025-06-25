const express = require('express')
const dbImport = require('./dbConnection')

const router = express.Router()
const db = dbImport.db

router.get('/', (req, res) => {
    db.query("SELECT * FROM subgroups", (err, data) => {
        res.send(data)
    })
})

module.exports = router