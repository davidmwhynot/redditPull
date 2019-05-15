/*

	title: index.js
	desc: Handler for requests to the / route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/18/18
	Updated: 10/22/18

*/

/* XXX IMPORTS XXX */
const express = require('express');

/* XXX ROUTES XXX */
let router = express.Router();
// get homepage
router.get('/', (req, res) => {
	log('GET request received for /...');
	res.render('index', {
		pageScript: 'index'
	});
});

/* XXX FUNCTIONS XXX */
function log(s) {
	console.log(s);
	// small change
}

/* XXX EXPORTS XXX */
module.exports = router;
