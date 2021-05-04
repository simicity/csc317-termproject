const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users');
const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var { validateUsername, validateEmail, validatePassword, validateConfirmPassword } = require('../middleware/formValidation');

router.post('/register', (req, res, next) => {
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	let cpassword = req.body.confirmPassword;

	//server side validation
	if((!validateUsername(username))
	 ||(!validateEmail(email))
	 ||(!validatePassword(password))
	 ||(!validateConfirmPassword(password, cpassword)))
	{
		errorPrint('Registration Failed: Form input is invalid');
		req.flash('error', 'Form input is invalid');
		return res.redirect('/register');
	}

	UserModel.usernameExists(username)
	.then((userNameDoesExist) => {
		if(userNameDoesExist) {
			throw new UserError(
				"Registration Failed: Username already exists",
				"/register",
				200
			);
		}
		else {
			return UserModel.emailExists(email);
		}
	})
	.then((emailDoesExist) => {
		if(emailDoesExist) {
			throw new UserError(
				"Registration Failed: Email already exists",
				"/register",
				200
			);
		}
		else {
			return UserModel.create(username, password, email);
		}
	})
	.then((createdUserId) => {
		if(createdUserId < 0) {
			throw new UserError(
				"Server Error: User could not be created",
				"/register",
				500
			);
		}
		else {
			successPrint("User.js --> user was created");
			req.flash('success', 'User accout has been made!');
			res.redirect("/login");
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

	UserModel.authenticate(username, password)
	.then((loggedUserId) => {
		if(loggedUserId > 0) {
			successPrint(`User ${username} is logged in`);
			req.session.username = username;
			req.session.userId = loggedUserId;
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
