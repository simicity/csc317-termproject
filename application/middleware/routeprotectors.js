const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const routeProtectors = {};

routeProtectors.userIsLoggedIn = function(req, res, next) {
	if(req.session.username) {
		successPrint('success', 'user is logged in');
		next();
	}
	else
	{
		errorPrint('user is not logged in');
		req.flash('error', 'You must be logged in to create a post!');
		res.redirect('/login');
	}
}

module.exports = routeProtectors;