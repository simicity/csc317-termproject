var express = require('express');
var router = express.Router();

var isLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postmiddleware').getRecentPosts;

var db = require('../config/database');

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
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

router.get('/post/:id(\\d+)', function(req, res, next) {
  let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created \
  FROM users u \
  JOIN posts p \
  ON u.id = fk_userId \
  WHERE p.id = ?;";

  let postId = req.params.id;

  db.execute(baseSQL, [postId])
  .then(([results, fields]) => {
  	if(results && results.length) {
  		let post = results[0];
		res.render('imagepost', {currentPost: post});
  	}
  	else {
  		req.flash('error', 'This is not the post you are looking for!');
  		res.redirect('/');
  	}
  })
});

module.exports = router;
