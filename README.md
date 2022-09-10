# CSC 317 Term Project

## Purpose

The purpose of this repository is to store all the code for your web application. This also includes the history of all commits made and who made them. Only code submitted on the master branch will be graded.

Please follow the instructions below and fill in the information requested when prompted.


# Build/Run Instructions

## Build Instructions
1. Clone the repository to your computer.
2. Navigate to the *application* directory and run the command below.  
   `npm install`
3. Create a database and grant "REFERENCES" to the database to a user. Below is the example of the commands.  
   `CREATE DATABASE csc317db;`  
   `GRANT REFERENCES ON csc317db.* TO 'photoapp'@'%';`
4. Open config/dbconfig.js and replace the values of the database, user, host, and password with yours.
5. Run the command below to create the tables.  
   `node config/dbsetup.js`  
   When "success!" is displayed without any error, it means the tables were successfully created. Exit by ctl+c.
6. If error occurs and/or tables cannot be created, create the tables manually.
   MySQL tables information is in config/SQL Dump.


## Run Instructions
1. Run the command below.  
   `npm start`
2. Access to [localhost:3000](http://localhost:3000)