const {getNRecentPosts, getPostById, deletePostById} = require('../models/Posts');
const {getCommentsForPost, deleteCommentsForPost} = require('../models/Comments');
const postMiddleware = {}

postMiddleware.getRecentPosts = async function(req, res, next) {
	try {
		let results = await getNRecentPosts(100);
		res.locals.results = results;
		if(results.length == 0) {
			req.flash('error', 'There are no post created yet');
		}
		next();
	}
	catch(err) {
		next(err);
	}
}

postMiddleware.getPostById = async function(req, res, next) {
	try {
		let postId = req.params.id;
		let results = await getPostById(postId);
		if(results && results.length) {
			res.locals.currentPost = results[0];
			res.locals.currentPost.postId = postId;
			next();
		}
		else {
			req.flash('error', 'This is not the post you are looking for');
			res.redirect('/');
		}
	}
	catch(err) {
		next(err);
	}
}

postMiddleware.getCommentsByPostId = async function(req, res, next) {
	let postId = req.params.id;
	try {
		let results = await getCommentsForPost(postId);
		res.locals.currentPost.comments = results;
		next();
	}
	catch(err) {
		next(err);
	}
}

postMiddleware.deletePostByPostId = async function(postId) {
	try {
		await deletePostById(postId);
		await deleteCommentsForPost(postId);
	}
	catch(err) {
	}
}

module.exports = postMiddleware;