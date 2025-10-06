const express = require('express')
const router = express.Router()
const pool = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    try {
        const [data] = await pool.execute("SELECT * FROM blog_articles")
        res.json(data)
    } catch (err) {
        console.error('Error fetching blog articles:', err)
        res.status(500).json({ error: 'Failed to fetch blog articles' })
    }
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

        const [data] = await pool.execute(
            "INSERT INTO `blog_articles`(`date`, `title`, `descr`, `content`, `image`) VALUES (?, ?, ?, ?, ?)",
            [date, naslov, opis, sadrzaj, imageUrl]
        );
        
        res.json(data);
    } catch (error) {
        console.error('Error uploading to Firebase or inserting data:', error);
        res.status(500).json({ error: 'Failed to create blog article' });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Get the image URL first
        const [result] = await pool.execute("SELECT `image` FROM `blog_articles` WHERE `id` = ?", [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Blog article not found' });
        }

        const imageUrl = result[0].image;

        // Delete image from Firebase if it exists
        if (imageUrl && imageUrl.startsWith('https://storage.googleapis.com/')) {
            const firebaseFileName = imageUrl.split(`${bucket.name}/`).pop();
            const file = bucket.file(firebaseFileName);
            await file.delete();
            console.log(`Deleted file: ${firebaseFileName}`);
        }

        // Delete the blog article from database
        const [data] = await pool.execute("DELETE FROM `blog_articles` WHERE `id` = ?", [id]);
        
        res.json({ message: 'Blog deleted successfully', data });
    } catch (error) {
        console.error('Error deleting blog or image:', error);
        res.status(500).json({ error: 'Failed to delete blog or image' });
    }
});

module.exports = router