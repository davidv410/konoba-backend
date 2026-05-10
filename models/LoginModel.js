const pool = require('../routes/dbConnection')

const findUser = async (username, password) => {
    const [data] = await pool.execute("SELECT * FROM users WHERE username = ?", [username])
    if(!data || data.length < 0){return res.status(401).json({ error: 'login error' })}
        if(data[0].password !== password){return res.status(401).json({ error: 'login error' })}
    return data
}

module.exports = { findUser }