/*

	title: app.js
	desc: Entry point for node server application
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/1/18
	Updated: 10/21/18

*/

/* XXX IMPORTS XXX */
const express = require('express');
const util = require('util');
const path = require('path');
const bodyParser = require('body-parser');
const hbars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);

// routers
const accounts = require(path.join(__dirname, 'src', 'routes', 'accounts.js'));
const index = require(path.join(__dirname, 'src', 'routes', 'index.js'));
const reddit = require(path.join(__dirname, 'src', 'routes', 'reddit.js'));
const subscribe = require(path.join(
	__dirname,
	'src',
	'routes',
	'subscribe.js'
));

/* XXX CONFIG XXX */
require('dotenv').config();
const PORT = process.env.REDDITPULL_PORT || 3000;
const SESSION_SECRET = process.env.REDDITPULL_SESSION_SECRET || 'secret';

const OPTS = {
	host: process.env.REDDITPULL_DB_HOST,
	user: process.env.REDDITPULL_DB_USER,
	password: process.env.REDDITPULL_DB_PASSWORD,
	database: process.env.REDDITPULL_DB_DATABASE,
	createDatabaseTable: false
	// connectionLimit: 2
};

/* XXX INIT XXX */
const app = express();
const sessionStore = new MySQLStore(OPTS);

/* XXX MIDDLEWARE XXX */
// view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.engine(
	'handlebars',
	hbars({
		defaultLayout: 'layout',
		layoutsDir: path.join(__dirname, 'src', 'views', 'layouts')
	})
);
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

// set static folder
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// session
app.use(
	session({
		secret: SESSION_SECRET,
		store: sessionStore,
		saveUninitialized: false,
		resave: false,
		rolling: true
	})
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// json
app.use(express.json());

/* XXX GLOBAL VARS XXX */
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.acct = req.user || null;
	log('\n--------- req.user ---------');
	log(req.user);
	log('----------------------------\n');
	log('\n--------- req.body ---------');
	log(req.body);
	log('----------------------------\n');
	next();
});

/* XXX ROUTES XXX */
app.use('/', index);
app.use('/accounts', accounts);
app.use('/reddit', reddit);
app.use('/subscribe', subscribe);

/* XXX SERVER XXX */
app.listen(PORT, () => {
	log(`Starting redditPull on port: ${PORT}`);
});

/* XXX FUNCTIONS XXX */
function log(s) {
	console.log(s);
}
