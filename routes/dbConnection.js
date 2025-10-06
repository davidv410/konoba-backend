const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER, 
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.PORT, // kad pusham na git ovo mora bit tu kad radim lokalno obrisat
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

pool.getConnection()
    .then(connection => {
        console.log('Database connected')
        connection.release()
    })
    .catch(err => {
        console.error('Database connection failed:', err)
        console.error('Make sure MySQL is running and environment variables are set')
    })

module.exports = pool