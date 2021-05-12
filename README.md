# CSC 317 Term Project

## Purpose

The purpose of this repository is to store all the code for your web application. This also includes the history of all commits made and who made them. Only code submitted on the master branch will be graded.

Please follow the instructions below and fill in the information requested when prompted.

## Student Information

|               | Information             |
|:-------------:|:-----------------------:|
| Student Name  | Miho Shimizu            |
| Student ID    | 920881842               |
| Student Email | mshimizu2@mail.sfsu.edu |



# Build/Run Instructions

## Build Instructions
1. Clone the repository to your computer.
2. Navigate to the *application* directory and run the command below.
   `npm install`
3. Open config/dbconfig.js and set appropriate values to the host, user, and password if needed.
   You can use the default values, but you must make sure the user is granted to create tables described in config/SQL Dump. 
4. Run the command below to create the database.
   `node config/dbsetup.js`
   When "success!" is displayed without any error, it means the tables were successfully created. Exit by ctl+c.
5. If error occurs and/or tables cannot be created, create the tables manually.
   MySQL tables information is in config/SQL Dump.


## Run Instructions
1. Run the command below
   `npm start`
2. Access to [localhost:3000](localhost:3000)