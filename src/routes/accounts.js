/*

	title: accounts.js
	desc: Handler for requests to the /accounts route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/18/18
	Updated: 10/18/18

*/


/* XXX IMPORTS XXX */
const express = require('express');
const zxcvbn = require('zxcvbn');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { check, body, validationResult } = require('express-validator/check');

const Acct = require('../db/models/account');




/* XXX CONFIG XXX */
// passport strategy
passport.use(
	new LocalStrategy((email, password, done) => {
		Acct.getAcctByEmail(email, (e, acct) => {
			if (!acct) {
				// email not found
				log(e);
				return done(null, false, { message: 'Invalid email or password' });
			} else {
				// email found
				Acct.comparePassword(password, acct.password, (er, isMatch) => {
					if(er) throw er;
					if (isMatch) {
						// password is correct
						return done(null, acct);
					} else {
						// incorrect password
						return done(null, false, { message: 'Invalid email or password' });
					}
				});
			}
		});
	})
);

passport.serializeUser((acct, done) => {
	done(null, acct.id);
});

passport.deserializeUser((id, done) => {
	Acct.getAcctById(id, (err, acct) => {
		done(err, acct);
	});
});




/* XXX ROUTES XXX */
let router = express.Router();
// get register
router.get('/register', (req, res) => {
	log('GET request received for /accounts/register...');
	res.render('accounts/register');
});

// get login
router.get('/login', (req, res) => {
	log('GET request received for /accounts/login...');
	res.render('accounts/login', {title: 'Login'});
});

// post register
router.post(
	'/register',
	[
		check('email', 'Missing header: email').exists(),
		check('email', 'Please enter a valid email address').isEmail(),
		check('password', 'Missing header: password').exists(),
		check('password').custom((val, { req }) => {
			let str = zxcvbn(val);
			if(str.score < 3) throw new Error('Password is too weak');
			return true;
		}),
		check('password2', 'Missing header: password2').exists(),
		check('password2', 'Passwords do not match').custom((val, { req }) =>
			val === req.body.password
		)
	],
	(req, res) => {
		log('POST request received for /accounts/register...');
		// attempt to register new user... at this point the email and password can both be assumed to be valid

		// check if email already exists on an account

		let errors = validationResult(req);
	  if(!errors.isEmpty()) {
	    res.render(
				'accounts/register',
				{
					errors: errors.array()
				}
			);
	  } else {
			Acct.createAcct(
				{
					email: req.body.email,
					password: req.body.password
				},
				(acct, err) => {
					if(err) {
						if(err.code === 'ER_DUP_ENTRY') {
							res.render(
								'accounts/register',
								{
									errors: [{location: 'body', param: 'email', value: req.body.email, msg: 'Email address already in use'}]
								}
							);
						} else {
							res.render(
								'accounts/register',
								{
									errors: [{msg: `Server error. Please contact support. Code: ${err.code}`}]
								}
							);
						}
					} else {
						log('account created');
						log(acct);
						req.flash('success_msg', 'Thanks for signing up!');
						res.redirect('/accounts/login');
					}
				}
			);
		}
	}
);

// post login
router.post('/login',
	(req, res, next) => {
		log('POST request received for /accounts/login...');
		next();
	},
	passport.authenticate(
		'local',
		{
			successRedirect: '/',
			failureRedirect: '/accounts/login',
			failureFlash: true
		}
	)
);

// get logout
router.get('/logout', (req, res) => {
	log('GET request received for /accounts/logout...');
	req.logout();

	req.flash('success_msg', 'You are logged out');

	let backURL = req.header('Referer') || '/';
	log('redirecting to: ');
	log(backURL);
	res.redirect(backURL);
});




/* XXX FUNCTIONS XXX */
function log(s) {
	console.log(s);
}




/* XXX EXPORTS XXX */
module.exports = router;
