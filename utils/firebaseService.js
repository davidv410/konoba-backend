const path = require('path')
const bucket = require('../routes/firebaseConfig')

const uploadToFirebase = async (file) => {
    if(!file){ return 'https://your-default-image-url.com/default.jpg' }

    const fileExtension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, fileExtension);
    const firebaseFileName = `${originalName}-${Date.now()}${fileExtension}`;
    const bucketFile = bucket.file(firebaseFileName);
    await bucketFile.save(file.buffer, {
        metadata: {
            contentType: file.mimetype,
        },
    });
    await bucketFile.makePublic();
    return bucketFile.publicUrl();
}

const deleteFromFirebase = async (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('https://storage.googleapis.com/')) {
        const firebaseFileName = imageUrl.split(`${bucket.name}/`).pop();
        const file = bucket.file(firebaseFileName);
        await file.delete();
        console.log(`Deleted file: ${firebaseFileName}`);
    }
    return console.log('image gone service')
}

const updateFirebaseImage = async (file, oldImageUrl) => {
    if(!file){ return console.log('new file doesnt exist') }
        const fileExtension = path.extname(file.originalname);
        const originalName = path.basename(file.originalname, fileExtension);
        const firebaseFileName = `${originalName}-${Date.now()}${fileExtension}`;
        const bucketFile = bucket.file(firebaseFileName);
        await bucketFile.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });
        await bucketFile.makePublic();
        const newImageUrl = bucketFile.publicUrl();
        if (oldImageUrl && oldImageUrl.startsWith('https://storage.googleapis.com/')) {
            const oldFirebaseFileName = oldImageUrl.split(`${bucket.name}/`).pop();
            const oldFile = bucket.file(oldFirebaseFileName);
            await oldFile.delete();
            console.log(`Deleted old file: ${oldFirebaseFileName}`);
        }

        return newImageUrl
}

module.exports = { uploadToFirebase, deleteFromFirebase, updateFirebaseImage }