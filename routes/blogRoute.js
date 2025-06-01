const express = require('express')
const router = express.Router()
const dbImport = require('./dbConnection')

const db = dbImport.db

router.get('/', (req, res) => {
    db.query("SELECT * FROM blog_articles", (err, data) => {
        res.json(data)
    })
})


router.post('/', (req, res) => {
    const { naslov, opis, sadrzaj } = req.body
    const date = new Date()
    db.query("INSERT INTO `blog_articles`(`date`, `title`, `descr`, `content`) VALUES (?, ?, ?, ?)", [date, naslov, opis, sadrzaj], (err, data) => {
        res.json(data)
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM blog_articles WHERE id = ?", [id], (err, data) => {
        res.json(data)
    })
})


module.exports = router