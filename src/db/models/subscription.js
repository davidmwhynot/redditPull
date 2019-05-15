/*

	title: subscription.js
	desc: Model for subscriptions
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 10/18/18
	Updated: 10/18/18

*/


/* XXX IMPORTS XXX */
const mysql = require('mysql');




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
	createSubscription: (accountId, stripeId, type, endTime, callback) => {
		let level = 0;
		if(type === 'supporter') {
			level = 1;
		} else if(type === 'premium') {
			level = 2;
		}
		if(level == 0) {
			callback('Invalid level');
		} else {
			mysql.createConnection(OPTS).query(
				'INSERT INTO subscription (subscription_account_id_f, subscription_stripe_id_f, subscription_type, subscription_endtime) VALUES (?, ?, ?, ?)',
				[accountId, stripeId, level, (endTime + (60*60*24))],
				(err, res, fields) => {
					if(err) {
						log('\n\n\nMySQL Error');
						log(err.toString());
						callback('MySQL Error');
					} else {
						callback(null);
					}
				}
			);
		}
	},
	getSubscriptionById: (id, callback) => {
		mysql.createConnection(OPTS).query(
			'SELECT * FROM subscription WHERE subscription_id = ?',
			id,
			(err, res) => {
				if(err) {
					throw err;
				} else {
					callback({
						id: res[0].subscription_id,
						account_id_f: res[0].subscription_account_id_f,
						stripe_id: res[0].subscription_stripe_id,
						type: res[0].subscription_type,
						endtime: res[0].subscription_endtime,
						confirmed: res[0].subscription_confirmed
					});
				}
			}
		);
	},
	getSubscriptionByStripeId: (id, callback) => {
		mysql.createConnection(OPTS).query(
			'SELECT * FROM subscription WHERE subscription_stripe_id = ?',
			id,
			(err, res) => {
				if(err) {
					throw err;
				} else {
					callback({
						id: res[0].subscription_id,
						account_id_f: res[0].subscription_account_id_f,
						stripe_id: res[0].subscription_stripe_id,
						type: res[0].subscription_type,
						endtime: res[0].subscription_endtime,
						confirmed: res[0].subscription_confirmed
					});
				}
			}
		);
	},
	confirmSubscriptionById: (id, callback) => {
		mysql.createConnection(OPTS).query(
			'UPDATE subscription SET subscription_confirmed = true WHERE subscription_id = ?',
			id,
			(err, res) => {
				if(err) {
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	},
	updateSubscriptionEndtimeById: (id, endtime, callback) => {
		mysql.createConnection(OPTS).query(
			'UPDATE subscription SET subscription_endtime = ? WHERE subscription_id = ?',
			[(endtime + (60*60*24)), id],
			(err, res) => {
				if(err) {
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	}
}

function log(s) {
	console.log(s);
}
