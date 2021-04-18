var express = require('express');
var router = express.Router();

var isLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {title: "Home"});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: "Log In"});
});

router.get('/register', function(req, res, next) {
  res.render('registration', {title: "Register"});
});

router.use('/postimage', isLoggedIn);
router.get('/postimage', function(req, res, next) {
  res.render('postimage', {title: "Post an Image"});
});

router.get('/imagepost', function(req, res, next) {
  res.render('imagepost', {title: "Post"});
});

module.exports = router;
