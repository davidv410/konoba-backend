const express = require('express')
const dbImport = require('./dbConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('./firebaseConfig');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()
const db = dbImport.db

router.post('/', upload.single('image'), async (req, res) => {
    const { id, title, descr, content } = req.body

    try{

        //db query
        const [existingBlog] = await new Promise((resolve, reject) => {
            db.query("SELECT image FROM blog_articles WHERE id = ?", [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        const oldImageUrl = existingBlog?.image;

        let newImageUrl = oldImageUrl;      

        if(req.file){
            //upload
            //delete old
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

            if (oldImageUrl) {
                const oldFirebaseFileName = oldImageUrl.split(`${bucket.name}/`).pop();
                const oldFile = bucket.file(oldFirebaseFileName);
                const radi = await oldFile.delete();
            }
        }

        db.query("UPDATE blog_articles SET title = ?, descr = ?, content = ?, image = ? WHERE id = ?", [title, descr, content, newImageUrl,id], (err, data) => {
            if(err){
                console.log(err)
            }else{
                console.log(data)
                res.json('blog updated')
            }
        })

    }catch{

    }


})

module.exports = router