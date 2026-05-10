const pool = require('../routes/dbConnection')

const getBlog = async (id) => {
    const [data] = await pool.execute("SELECT image FROM blog_articles WHERE id = ?", [id])
    return data
}

const getBlogs = async () => {
    const [data] = await pool.execute("SELECT * FROM blog_articles")
    return data
}

const updateBlog = async (title, descr, content, newImageUrl, id) => {
    const query = "UPDATE blog_articles SET title = ?, descr = ?, content = ?, image = ? WHERE id = ?"
    const VALUES = [title, descr, content, newImageUrl, id]
    const [data] = await pool.execute(query, VALUES)
    return data
}

const insertBlog = async (date, naslov, opis, sadrzaj, imageUrl) => {
    const query = "INSERT INTO `blog_articles`(`date`, `title`, `descr`, `content`, `image`) VALUES (?, ?, ?, ?, ?)"
    const VALUES = [date, naslov, opis, sadrzaj, imageUrl]
    const [data] = await pool.execute(query, VALUES)
    return data
}

const getImage = async (id) => {
    const [data] = await pool.execute("SELECT `image` FROM `blog_articles` WHERE `id` = ?", [id]);
    return data
}

const deleteBlog = async (id) => {
    const [data] = await pool.execute("DELETE FROM blog_articles WHERE id = ?", [id]);
    return data
}

module.exports = { getBlog, getBlogs, updateBlog, insertBlog, getImage, deleteBlog }