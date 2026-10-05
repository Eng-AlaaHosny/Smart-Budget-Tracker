require('dotenv').config()
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'smart_budget',
    port: Number(process.env.DB_PORT) || 3306,
});

module.exports = pool.promise();
