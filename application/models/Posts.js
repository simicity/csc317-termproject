var db = require('../config/database');
const {getNumberOfCommentById} = require('../models/Comments');
const PostModel = {};

PostModel.create = (title, description, photopath, thumbnail, fk_userId) => {
	let baseSQL = "INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userId) VALUES (?, ?, ?, ?, now(), ?);";
	return db.execute(baseSQL, [title, description, photopath, thumbnail, fk_userId])
	.then(([results, fields]) => {
		return Promise.resolve(results && results.affectedRows);
	})
	.catch((err) => Promise.reject(err));
}

PostModel.search = (searchTerm) => {
	let baseSQL = "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ?;";
	let sqlReadySearchTerm = "%" + searchTerm + "%";
	return db.execute(baseSQL, [sqlReadySearchTerm])
	.then(([results, fields]) => {
		return Promise.resolve(results);
	})
	.catch((err) => Promise.reject(err));
}

PostModel.getNRecentPosts = (numberOfPost) => {
	let baseSQL = "SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT " + numberOfPost;
	return db.execute(baseSQL, [])
	.then(([results, fields]) => {
		results.forEach((result) => {
			getNumberOfCommentById(result.id)
			.then((length) => {
				result.comment = length;
			})
		})
		return Promise.resolve(results);
	})
	.catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
	let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created \
	FROM users u \
	JOIN posts p \
	ON u.id = fk_userId \
	WHERE p.id = ?;";

	return db.execute(baseSQL, [postId])
	.then(([results, fields]) => {
		return Promise.resolve(results);
	})
	.catch((err) => Promise.reject(err));
}

PostModel.deletePostById = (userId, postId) => {
	return db.execute ("SELECT fk_userid FROM posts WHERE id = ?", [postId])
	.then(([results,fields]) => {
		return results[0].fk_userid == userId;
	})
	.then((currentUserIsOwner) => {
		if(currentUserIsOwner) {
			return db.execute("DELETE FROM posts WHERE id = ?", [postId]);
		}
	})
	.then(([results, fields]) => {
		return Promise.resolve(results.affectedRows);
	})
	.catch((err) => Promise.reject(err));
}

module.exports = PostModel;