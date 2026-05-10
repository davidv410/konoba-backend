const pool = require('../routes/dbConnection')

const getImages = async () => {
    const [data] = await pool.execute("SELECT * FROM gallery")
    return data
}

const uploadImage = async (imageUrl) => {
    const [data] = await pool.execute("INSERT INTO gallery (image_path) VALUES (?)", [imageUrl])
    return data
}

const getImage = async (id) => {
    const [data] = await pool.execute("SELECT * FROM gallery WHERE id = ?", [id])
    return data
}

const deleteImage = async (id) => {
    const [data] = await pool.execute("DELETE FROM gallery WHERE id = ?", [id])
    return data
}

module.exports = { getImages, uploadImage, deleteImage, getImage }