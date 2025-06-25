const express = require('express')
const dbImport = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');


const router = express.Router()
const db = dbImport.db

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
    db.query("SELECT * FROM gallery", (err, data) => {
        res.json(data)
    })
})

router.post('/', upload.single('image'), async (req, res) => {

    const date = new Date();
    let imageUrl = null;

    try{
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

        db.query("INSERT INTO gallery (image_path) VALUES (?)", [imageUrl], (err, data) => {
            res.json(data)
        })

    }catch{

    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try{
        db.query('SELECT * FROM gallery WHERE id = ?', [id], async (err, data) => {
            if (err) {console.log(err)}
            if (data.length === 0) { }
            const imageUrl = data[0].image_path;
            if (imageUrl && imageUrl.startsWith('https://storage.googleapis.com/')) {
                const firebaseFileName = imageUrl.split(`${bucket.name}/`).pop();
                const file = bucket.file(firebaseFileName);
                await file.delete();
                console.log(`Deleted file: ${firebaseFileName}`);
            }
            db.query("DELETE FROM gallery WHERE id = ?", [id], (err, data) => {
                if (err) {res.json({ message: 'Failed to delete image', data });}
                res.json({ message: 'Image deleted successfully', data });
            })
        })
    }catch{
        console.error('Something went wrong: gallery', error);
        res.json({ error: 'Something went wrong: gallery' });
    }
})

module.exports = router