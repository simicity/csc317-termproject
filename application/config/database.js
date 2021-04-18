const mysql = require('mysql2');
const dbconfig = require('./config');

const pool = mysql.createPool ({
	connectionLimit: 50,
	host: 'localhost',
	user: 'photoapp',
	password: dbconfig.password,
	database: 'csc317db',
	debug: false,
});

const promisePool = pool.promise();

module.exports = promisePool;