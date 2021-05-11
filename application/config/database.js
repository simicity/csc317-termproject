const mysql = require('mysql2');
const dbConfig = require('./dbconfig');

const pool = mysql.createPool ({
	connectionLimit: 50,
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
	debug: false,
});

const promisePool = pool.promise();

module.exports = promisePool;