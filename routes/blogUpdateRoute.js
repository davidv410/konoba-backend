const express = require('express')
const pool = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.post('/', upload.single('image'), async (req, res) => {
    const { id, title, descr, content } = req.body

    try {
        // Get existing blog data
        const [existingBlog] = await pool.execute("SELECT image FROM blog_articles WHERE id = ?", [id]);

        if (existingBlog.length === 0) {
            return res.status(404).json({ error: 'Blog article not found' });
        }

        const oldImageUrl = existingBlog[0]?.image;
        let newImageUrl = oldImageUrl;      

        if (req.file) {
            // Upload new image
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
            newImageUrl = file.publicUrl();

            // Delete old image if it exists
            if (oldImageUrl && oldImageUrl.startsWith('https://storage.googleapis.com/')) {
                const oldFirebaseFileName = oldImageUrl.split(`${bucket.name}/`).pop();
                const oldFile = bucket.file(oldFirebaseFileName);
                await oldFile.delete();
                console.log(`Deleted old file: ${oldFirebaseFileName}`);
            }
        }

        // Update blog article
        const [data] = await pool.execute(
            "UPDATE blog_articles SET title = ?, descr = ?, content = ?, image = ? WHERE id = ?", 
            [title, descr, content, newImageUrl, id]
        );

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Blog article not found' });
        }

        res.json({ message: 'Blog updated successfully', data });

    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ error: 'Failed to update blog article' });
    }
});

module.exports = router