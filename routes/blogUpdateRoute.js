const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');
const BlogModel = require('../models/BlogModel')
const firebaseService = require('../utils/firebaseService') 
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.post('/', upload.single('image'), async (req, res, next) => {
    const { id, title, descr, content } = req.body
    try {
        const existingBlog = await BlogModel.getBlog(id)
        if (existingBlog.length === 0) { return res.status(404).json({ error: 'Blog article not found' }); }
        const oldImageUrl = existingBlog[0]?.image;   
        let newImageUrl = oldImageUrl
        if(req.file){
            newImageUrl = await firebaseService.updateFirebaseImage(req.file, oldImageUrl)
        }
        const updateBlog = await BlogModel.updateBlog(title, descr, content, newImageUrl, id)
        if (updateBlog.affectedRows === 0) { return res.status(404).json({ error: 'Blog article not found' });}
        res.json({ message: 'Blog updated successfully', updateBlog });
        
    } catch (err) {
        next(err)
    }
});

module.exports = router