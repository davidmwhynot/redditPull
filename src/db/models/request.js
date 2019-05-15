/*

	title: request.js
	desc: Model for requests
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
	createRequest: (accountId, sub, callback) => {
		mysql.createConnection(OPTS).query(
			'INSERT INTO request (request_account_id_f, request_time, request_sub) VALUES (?, ?, ?)',
			[accountId, Math.round(new Date().getTime() / 1000.0), sub],
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
	},
	getNumRequestsByAccountId: (id, callback) => {
		mysql.createConnection(OPTS).query(
			'SELECT COUNT(request_id) AS num FROM request WHERE request_account_id_f = ?',
			id,
			(err, res) => {
				if(err) {
					callback(null, err);
				} else {
					log(res[0].num);
					callback(res[0].num, null);
				}
			}
		);
	}
}

function log(s) {
	console.log(s);
}
