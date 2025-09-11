const express = require('express')
const router = express.Router()
const dbImport = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');

const upload = multer({ storage: multer.memoryStorage() });

const db = dbImport.db

router.get('/', (req, res) => {
    db.query("SELECT * FROM blog_articles", (err, data) => {
        if(data){
            res.json(data)
        }
    })
})


router.post('/', upload.single('slika'), async (req, res) => {
   const { naslov, opis, sadrzaj } = req.body;

    const date = new Date();

    let imageUrl = null;

    try {
        if (req.file) {
            const fileExtension = path.extname(req.file.originalname);
            const originalName = path.basename(req.file.originalname, fileExtension);
            const firebaseFileName = `${originalName}-${Date.now()}${fileExtension}`;

            const file = bucket.file(firebaseFileName);
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            await file.makePublic();

            imageUrl = file.publicUrl();
        } else {
            imageUrl = 'https://your-default-image-url.com/default.jpg'; // OVO MORAM PROMJENUT
        }

      
        db.query(
            "INSERT INTO `blog_articles`(`date`, `title`, `descr`, `content`, `image`) VALUES (?, ?, ?, ?, ?)",
            [date, naslov, opis, sadrzaj, imageUrl],
            (err, data) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).json({ error: 'Failed to insert data' });
                }
                res.json(data);
            }
        );
    } catch (error) {
        console.error('Error uploading to Firebase:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        db.query("SELECT `image` FROM `blog_articles` WHERE `id` = ?", [id], async (err, result) => {
            if (err) {console.log(err)}
            if (result.length === 0) { }
            const imageUrl = result[0].image;
            if (imageUrl && imageUrl.startsWith('https://storage.googleapis.com/')) {
                const firebaseFileName = imageUrl.split(`${bucket.name}/`).pop();
                const file = bucket.file(firebaseFileName);
                await file.delete();
                console.log(`Deleted file: ${firebaseFileName}`);
            }
            db.query("DELETE FROM `blog_articles` WHERE `id` = ?", [id], (err, data) => {
                if (err) {res.json({ message: 'Failed to delete blog', data });}
                res.json({ message: 'Blog deleted successfully', data });
            });
        });
    } catch (error) {
        console.error('Error deleting blog or image:', error);
        res.json({ error: 'Failed to delete blog or image' });
    }
});


module.exports = router