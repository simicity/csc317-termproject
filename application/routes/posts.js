var express = require('express');
var router = express.Router();
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var { deletePostByPostId } = require('../middleware/postmiddleware');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var isLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;
var PostError = require('../helpers/error/PostError');
var PostModel = require('../models/Posts');
var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, "public/images/uploads");
	},
	filename: function(req, file, cb){
		let fileExt = file.mimetype.split('/')[1];
		let randomName = crypto.randomBytes(22).toString("hex");
		cb(null, `${randomName}.${fileExt}`);
	}
});

var uploader = multer({storage: storage});

router.post('/createpost', uploader.single("uploadImage"), (req, res, next) => {
	let fileUploaded = req.file.path;
	let fileAsThumbnail = `thumbnail-${req.file.filename}`;
	let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
	let title = req.body.title;
	let description = req.body.description;
	let fk_userId = req.session.userId;

	//validation
	if((fileUploaded == null)
	 ||(fileAsThumbnail == null)
	 ||(destinationOfThumbnail == null)
	 ||(title == null)
	 ||(description == null)
	 ||(fk_userId == null))
	{
		errorPrint('Registration Failed: Form input is invalid');
		req.flash('error', 'Form input is invalid');
		return res.render('postimage', {title: "Post an Image"});
	}

	sharp(fileUploaded)
	.resize(200)
	.toFile(destinationOfThumbnail)
	.then(() => {
		return PostModel.create(title, description, fileUploaded, destinationOfThumbnail, fk_userId);
	})
	.then((postWasCreated) => {
		if(postWasCreated) {
			req.flash('success', "Your post was created successfully!");
			res.redirect('/');
		}
		else {
			throw new PostError('Post could not be created', '/postimage', 200);
		}
	})
	.catch((err) => {
		if(err instanceof PostError) {
			errorPrint(err.getMessage());
			req.flash('error', err.getMessage());
			res.status(err.getStatus());
			res.redirect(err.getRedirectURL());
		}
	})
});

router.get('/search', async(req, res, next) => {
	try {
		let searchTerm = req.query.search;
		if(!searchTerm) {
			res.send({
				message: "No search term given",
				results: []
			});
		}
		else {
			let results = await PostModel.search(searchTerm);
			if(results.length) {
				res.send({
					message: `${results.length} results found`,
					results: results
				});
			}
			else {
				let results = await PostModel.getNRecentPosts(100);
				res.send({
					message: "No results were found for your search but here are recent posts",
					results: results
				});
			}
		}
	}
	catch(err) {
		next(err);
	}
});

router.use('/delete', isLoggedIn);
router.get('/delete/:id(\\d+)', async function(req, res, next) {
	try {
		let result = await deletePostByPostId(req.session.userId, req.params.id);
		if(result > 0) {
			res.redirect('/');
		}
		else {
			throw new PostError('You cannot delete another user\'s post', '/', 400);
		}
	}
	catch(err) {
		if(err instanceof PostError) {
			errorPrint(err.getMessage());
			req.flash('error', err.getMessage());
			res.status(err.getStatus());
			res.redirect(err.getRedirectURL());
		}
		next(err);
	}
});

module.exports = router;