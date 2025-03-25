require('dotenv').config()
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'sql7.freesqldatabase.com',      // Database host address
    user: 'sql7755540',           // Database user name
    password: 'y7QkdjQl2d',           // Database password
    database: 'sql7755540', // Database name
});

module.exports = pool.promise(); // Promise-based connection usage
