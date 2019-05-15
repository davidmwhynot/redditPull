/*

	title: reddit.js
	desc: Handler for requests to the /reddit route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/18/18
	Updated: 9/18/18

*/

/* XXX IMPORTS XXX */
const express = require('express');
const snoowrap = require('snoowrap');
const util = require('util');
const _ = require('lodash');
const { body, validationResult } = require('express-validator/check');

const Request = require('../db/models/request');

/* XXX CONFIG XXX */
require('dotenv').config();
const CREDS = {
	userAgent: process.env.REDDITPULL_USERAGENT,
	clientId: process.env.REDDITPULL_CLIENTID,
	clientSecret: process.env.REDDITPULL_CLIENTSECRET,
	username: process.env.REDDITPULL_USERNAME,
	password: process.env.REDDITPULL_PASSWORD
};

/* XXX ROUTES XXX */
let router = express.Router();
// main route
router.post(
	'/',
	[
		body('sub').exists(),
		body('sub').isLength({ min: 3 }),
		body('sort').exists()
	],
	rateLimit,
	(req, res) => {
		log('POST request received for /reddit...');
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let wrap = new snoowrap(CREDS);
		wrap
			._getSortedFrontpage(req.body.sort, req.body.sub)
			.then(sub => {
				sub = sub.filter(i => !i.stickied);
				res.json(sub);
			})
			.catch(e => {
				res.status(e.statusCode).send(e);
			});
	}
);

// get more posts
router.post(
	'/more',
	[body('after').exists(), body('sub').exists(), body('sort').exists()],
	rateLimit,
	(req, res) => {
		log('POST request received for /reddit/more...');

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let wrap = new snoowrap(CREDS);
		wrap
			._getSortedFrontpage(req.body.sort, req.body.sub, {
				after: req.body.after
			})
			.then(posts => res.json([posts.length == 0, posts]))
			.catch(e => {
				res.json(e);
			});
	}
);

/* XXX FUNCTIONS XXX */

function log(s) {
	console.log(s);
}

function rateLimit(req, res, next) {
	if (req.isAuthenticated()) {
		log('REQUEST AUTHENTICATED');
		// rate limit account
		Request.getNumRequestsByAccountId(req.user.id, (num, err) => {
			if (err) {
				throw err;
			} else {
				log('num');
				log(num);
				if (req.user.type) {
					if (req.user.type == 1) {
						if (num <= 200) {
							Request.createRequest(req.user.id, req.body.sub, err => {
								if (err) throw error;
								next();
							});
						} else {
							res.sendStatus(403);
						}
					} else if (req.user.type == 2) {
						Request.createRequest(req.user.id, req.body.sub, err => {
							if (err) throw error;
							next();
						});
					} else {
						log('error: invalid user.type! please contact support');
					}
				} else {
					if (num <= 20) {
						Request.createRequest(req.user.id, req.body.sub, err => {
							if (err) throw error;
							next();
						});
					} else {
						res.sendStatus(403);
					}
				}
			}
		});
	} else {
		log('REQUEST NOT AUTHENTICATED');
		log('rate limit ip...');
		// rate limit ip
		// TODO
		next();
	}
}

function limitExceeded(req, res) {}

/* XXX EXPORTS XXX */
module.exports = router;
