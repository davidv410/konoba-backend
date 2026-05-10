const express = require('express')
const pool = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');
const GalleryModel = require('../models/GalleryModel')
const firebaseService = require('../utils/firebaseService')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res, next) => {
    try {
        const data = await GalleryModel.getImages()
        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.post('/', upload.single('image'), async (req, res, next) => {
    try{
        const imageUrl = await firebaseService.uploadToFirebase(req.file)
        const data = await GalleryModel.uploadImage(imageUrl) // ovdje ide return ovog gore
        res.json(data)
    }catch(err){
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const result = await GalleryModel.getImage(id)
        if (result.length === 0) {return res.status(404).json({ error: 'Gallery image not found' });}
        const imageUrl = result[0].image_path;
        const deleteFromFire = firebaseService.deleteFromFirebase(imageUrl)
        const data = await GalleryModel.deleteImage(id)
        console.log('image gone route')
        res.json({ message: 'Image deleted successfully', data });
    } catch (err) {
        next(err)
    }
})

module.exports = router