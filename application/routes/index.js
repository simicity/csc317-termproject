var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {title: "Home"});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: "Log In"});
});

router.get('/registration', function(req, res, next) {
  res.render('registration', {title: "Register"});
});

router.get('/postimage', function(req, res, next) {
  res.render('postimage', {title: "Post an Image"});
});

router.get('/imagepost', function(req, res, next) {
  res.render('imagepost', {title: "Post"});
});

module.exports = router;
