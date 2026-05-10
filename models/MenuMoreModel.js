const pool = require('../routes/dbConnection')

const getData = async () => {
    const [data] = await pool.execute("SELECT * FROM meat_type")
    return data
}

module.exports = { getData }