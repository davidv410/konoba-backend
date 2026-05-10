const express = require('express')
const router = express.Router()
const pool = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');
const BlogModel = require('../models/BlogModel')
const firebaseService = require('../utils/firebaseService')

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res, next) => {
    try {
        const data = await BlogModel.getBlogs()
        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.post('/', upload.single('slika'), async (req, res, next) => {
    const { naslov, opis, sadrzaj } = req.body;
    const date = new Date();

    try {
        const imageUrl = await firebaseService.uploadToFirebase(req.file)
        const data = await BlogModel.insertBlog(date, naslov, opis, sadrzaj, imageUrl)
        res.json(data);
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await BlogModel.getImage(id)
        if (result.length === 0) {return res.status(404).json({ error: 'Blog article not found' });}
        const imageUrl = result[0].image;
        const deleteFromFire = firebaseService.deleteFromFirebase(imageUrl)
        const data = await BlogModel.deleteBlog(id)
        console.log('image gone route')
        res.json({ message: 'Blog deleted successfully', data });
    } catch (err) {
        next(err)
    }
});

module.exports = router