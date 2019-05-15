/*

	title: account.js
	desc: Model for user accounts
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/19/18
	Updated: 9/19/18

*/


/* XXX IMPORTS XXX */
const mysql = require('mysql');
const bcrypt = require('bcryptjs');




/* XXX CONFIG XXX */
require('dotenv').config();
const OPTS = {
	host: process.env.REDDITPULL_DB_HOST,
	user: process.env.REDDITPULL_DB_USER,
	password: process.env.REDDITPULL_DB_PASSWORD,
	database: process.env.REDDITPULL_DB_DATABASE
};




/* XXX EXPORTS XXX */
module.exports = {
	/* XXX FUNCTIONS XXX */
	createAcct: (newAcct, callback) => {
		bcrypt.genSalt(10, (e, salt) => {
			if (e) callback(null, e);
			bcrypt.hash(newAcct.password, salt, (er, hash) => {
				if (er) callback(null, er);
				mysql.createConnection(OPTS).query('INSERT INTO account (account_email, account_auth) VALUES (?, ?)', [newAcct.email, hash], (err, res, fields) => {
					if (err) {
						callback(null, err);
					} else {
						callback(newAcct, null);
					}
				});
			});
		});
	},
	getAcctByEmail: (email, callback) => {
		mysql.createConnection(OPTS).query('SELECT * FROM account WHERE account_email = ?', email, (err, res) => {
			if(err) {
				callback(err, null);
			} else if(res.length == 0) {
				callback('Invalid email', null);
			} else {
				callback(
					null,
					{
						id: res[0].account_id,
						email: res[0].account_email,
						password: res[0].account_auth
					}
				);
			}
		});
	},
	getAcctById: (id, callback) => {
		mysql.createConnection(OPTS).query('SELECT * FROM account WHERE account_id = ?', id, (err, res) => {
			if(err) {
				callback(err, null);
			} else {
				mysql.createConnection(OPTS).query(
					'SELECT subscription_type FROM subscription WHERE subscription_endtime > ? AND subscription_account_id_f = ?',
					[Math.round(new Date().getTime() / 1000.0), id],
					(err, sub) => {
						if(err) {
							callback(err, null);
						} else {
							if(sub.length == 0) {
								callback(
									null,
									{
										id: res[0].account_id,
										email: res[0].account_email,
										type: 0
									}
								);
							} else if(sub.length > 0) {
								callback(
									null,
									{
										id: res[0].account_id,
										email: res[0].account_email,
										type: Math.max(...sub.map(i => i.subscription_type))
									}
								)
							} else {
								callback('Negative value for sub.length???', null);
							}
						}
					}
				);
			}
		});
	},
	comparePassword: (candidatePassword, hash, callback) => {
		bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
			if(err) throw err;
    	callback(null, isMatch);
		});
	}
}

function log(s) {
	console.log(s);
}
