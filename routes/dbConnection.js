const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER, 
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.PORT // kad pusham na git ovo mora bit tu kad radim lokalno obrisat
})

db.connect((err) => {
    if(err){return console.log(err)}
    console.log('Database connected')
})

exports.db = db