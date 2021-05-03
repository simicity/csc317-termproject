const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var { validateUsername, validateEmail, validatePassword, validateConfirmPassword } = require('../middleware/formValidation');

/* GET users listing. */
router.get('/', function(req, res, next) {
	db.execute("SELECT * FROM users")
	.then(([results, fields]) => {
		console.log(fields);
	});
	res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	let cpassword = req.body.confirmPassword;

	//server side validation
	if((!validateUsername(username))
	 ||(!validateEmail(email))
	 ||(!validatePassword(password))
	 ||(!validateConfirmPassword(cpassword)))
	{
		errorPrint('Registration Failed: Form input is invalid');
		req.flash('error', 'Form input is invalid');
		return res.redirect('/register');
	}

	db.execute("SELECT * FROM users WHERE username=?", [username])
	.then(([results, fields]) => {
		if(results && results.length == 0) {
			return db.execute("SELECT * FROM users WHERE email=?", [email]);
		}
		else {
			throw new UserError(
				"Registration Failed: Username already exists",
				"/register",
				200
			);
		}
	})
	.then(([results, fields]) => {
		if(results && results.length == 0) {
			return bcrypt.hash(password, 15);
		}
		else {
			throw new UserError(
				"Registration Failed: Email already exists",
				"/register",
				200
			);
		}
	})
	.then((hashedPassword) => {
		let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());"
		return db.execute(baseSQL, [username, email, hashedPassword]);
	})
	.then(([results, fields]) => {
		if(results && results.affectedRows) {
			successPrint("User.js --> user was created");
			req.flash('success', 'User accout has been made!');
			res.redirect("/login");
		}
		else {
			throw new UserError(
				"Server Error: User could not be created",
				"/register",
				500
			);
		}
	})
	.catch((err) => {
		errorPrint("user could not made", err);
		if(err instanceof UserError) {
			errorPrint(err.getMessage());
			req.flash('error', err.getMessage());
			res.status(err.getStatus());
			res.redirect(err.getRedirectURL());
		}
		else {
			next(err);
		}
	});
});

router.post('/login', (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;

	//server side validation
	if((!validateUsername(username))
	 ||(!validatePassword(password)))
	{
		errorPrint('Registration Failed: Form input is invalid');
		req.flash('error', 'Form input is invalid');
		return res.redirect('/login');
	}

	let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
	let userId;
	db.execute(baseSQL, [username])
	.then(([results, fields]) => {
		if(results && results.length == 1) {
			let hashedPassword = results[0].password;
			userId = results[0].id;
			return bcrypt.compare(password, hashedPassword);
		}
		else {
			throw new UserError(
				"Invalid username and/or password",
				"/login",
				200
			);
		}
	})
	.then((passwordMatched) => {
		if(passwordMatched) {
			successPrint(`User ${username} is logged in`);
			req.session.username = username;
			req.session.userId = userId;
			res.locals.logged = true;
			req.flash('success', 'You have been successfully logged in!');
			res.redirect('/');
		}
		else {
			throw new UserError(
				"Password didn't match",
				"/login",
				200
			);
		}
	})
	.catch((err) => {
		errorPrint("user login failed");
		if(err instanceof UserError) {
			errorPrint(err.getMessage());
			req.flash('error', err.getMessage());
			res.status(err.getStatus());
			res.redirect(err.getRedirectURL());
		}
		else {
			next(err);
		}
	});
});

router.post('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if(err) {
			errorPrint("session could not be destroyed");
			next(err);
		}
		else {
			successPrint("session was destroyed");
			res.clearCookie('csid');
			res.json({status: "OK", message: "user is logged out"});
		}
	})
});

module.exports = router;
