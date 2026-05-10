const pool = require('../routes/dbConnection')

const getData = async () => {
    const [data] = await pool.execute("SELECT * FROM menus")
    return data
}

const updateData = async (name, id) => {
    const [update] = await pool.execute("UPDATE menus SET name = ? WHERE id = ?", [name, id])
    return update
}

module.exports = { getData, updateData }