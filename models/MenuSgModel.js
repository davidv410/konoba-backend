const pool = require('../routes/dbConnection')

const getData = async () => {
    const [data] = await pool.execute("SELECT * FROM subgroups")
    return data
}

const updateData = async (name, id) => {
    const [update] = await pool.execute("UPDATE subgroups SET name = ? WHERE id = ?", [name, id])
    return update
}

module.exports = { getData, updateData }