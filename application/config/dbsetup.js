const mysql = require('mysql2');
const dbConfig = require('./dbconfig');

//create connection
const db = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password
});

var err_caught = false;

//create database if not exists
try {
  db.query("CREATE DATABASE IF NOT EXISTS " + dbConfig.database + ";");
}
catch {
  err_caught = true;
  console.log(err);
}

console.log("Database created");

//switch to the created database
try {
  db.changeUser({database : dbConfig.database});
}
catch {
  err_caught = true;
  console.log(err);
}

let createSessions = "CREATE TABLE IF NOT EXISTS sessions (\
  session_id varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,\
  expires int unsigned NOT NULL,\
  data mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,\
  PRIMARY KEY (session_id)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";

let createUsers = "CREATE TABLE IF NOT EXISTS users (\
  id int NOT NULL AUTO_INCREMENT,\
  username varchar(64) NOT NULL,\
  email varchar(128) NOT NULL,\
  password varchar(128) NOT NULL,\
  usertype int DEFAULT 0,\
  active int DEFAULT 0,\
  created datetime DEFAULT NULL,\
  PRIMARY KEY (id),\
  UNIQUE KEY id_UNIQUE (id),\
  UNIQUE KEY username_UNIQUE (username),\
  UNIQUE KEY email_UNIQUE (email)\
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";

let createPosts = "CREATE TABLE IF NOT EXISTS posts (\
  id int NOT NULL AUTO_INCREMENT,\
  title varchar(128) NOT NULL,\
  description varchar(4096) NOT NULL,\
  photopath varchar(4096) NOT NULL,\
  thumbnail varchar(4096) NOT NULL,\
  active int DEFAULT 0,\
  created datetime NOT NULL,\
  fk_userid int NOT NULL,\
  PRIMARY KEY (id),\
  UNIQUE KEY id_UNIQUE (id),\
  KEY `posts to users_idx` (fk_userid),\
  CONSTRAINT `posts to users` FOREIGN KEY (fk_userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE\
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";

let createComments = "CREATE TABLE IF NOT EXISTS comments (\
  id int NOT NULL AUTO_INCREMENT,\
  comment longtext NOT NULL,\
  fk_authorid int unsigned NOT NULL,\
  fk_postid int unsigned NOT NULL,\
  created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\
  PRIMARY KEY (id),\
  UNIQUE KEY id_UNIQUE (id),\
  KEY key_toposttabke_idx (fk_postid),\
  KEY key_tousertable_idx (fk_authorid)\
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";

console.log("Creating database... ");

try {
	db.query(createSessions);
}
catch(err) {
	err_caught = true;
	console.log(err.message);
}

try {
	db.query(createUsers);
}
catch(err) {
	err_caught = 1;
	console.log(err.message);
}

try {
	db.query(createPosts);
}
catch(err) {
	err_caught = 1;
	console.log(err.message);
}

try {
	db.query(createComments);
}
catch(err) {
	err_caught = 1;
	console.log(err.message);
}

if(!err_caught) {
  console.log("success!");
}
