const express = require('express')
const pool = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    try {
        const [data] = await pool.execute("SELECT * FROM gallery")
        res.json(data)
    } catch (err) {
        console.error('Error fetching gallery:', err)
        res.status(500).json({ error: 'Failed to fetch gallery' })
    }
})

router.post('/', upload.single('image'), async (req, res) => {
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

        const [data] = await pool.execute("INSERT INTO gallery (image_path) VALUES (?)", [imageUrl])
        res.json(data)

    } catch (error) {
        console.error('Error uploading to Firebase or inserting data:', error);
        res.status(500).json({ error: 'Failed to create gallery image' });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        // Get the image URL first
        const [result] = await pool.execute('SELECT * FROM gallery WHERE id = ?', [id])
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        const imageUrl = result[0].image_path;

        // Delete image from Firebase if it exists
        if (imageUrl && imageUrl.startsWith('https://storage.googleapis.com/')) {
            const firebaseFileName = imageUrl.split(`${bucket.name}/`).pop();
            const file = bucket.file(firebaseFileName);
            await file.delete();
            console.log(`Deleted file: ${firebaseFileName}`);
        }

        // Delete the gallery image from database
        const [data] = await pool.execute("DELETE FROM gallery WHERE id = ?", [id])
        
        res.json({ message: 'Image deleted successfully', data });
        
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Failed to delete gallery image' });
    }
})

module.exports = router