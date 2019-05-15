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
const _ = require('lodash');

const Subscription = require('../db/models/subscription');




/* XXX CONFIG XXX */
require('dotenv').config();
const STRIPE_PUBLIC = process.env.REDDITPULL_STRIPE_PUBLIC;
const STRIPE_SECRET = process.env.REDDITPULL_STRIPE_SECRET;

const stripe = require('stripe')(STRIPE_SECRET);




/* XXX ROUTES XXX */
let router = express.Router();

// get subscribe
router.get('/', (req, res) => {
	log('GET request received for /subscribe...');
	res.render('subscribe/subscribe', {
    stripePublishableKey: STRIPE_PUBLIC,
		pageScript: 'subscribe'
  });
});

// post subscribe
router.post('/:type', ensureAuthenticated, (req, res) => {
	log(`POST request received for /subscribe/${req.params.type}...`);
	let amount, plan, type;
	if(req.params.type === 'supporter') {
		amount = 199;
		plan = 'plan_Do5Z8JO6AscGe1';
		type = 'supporter';
	} else if(req.params.type === 'premium') {
		amount = 999;
		plan = 'plan_Do5Z6H3sOdkOtO';
		type = 'premium';
	}

	stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.subscriptions.create({
		customer: customer.id,
		items: [{ plan: plan }]
  })).then((subscription) => {
		Subscription.createSubscription(req.user.id, subscription.id, type, subscription.current_period_end, (err) => {
			if(err) {
				log(err);
			} else {
				req.flash('success_msg', `You have unlocked a ${type} subscription! Thank you!`);
				res.redirect('/');
			}
		});
	}).catch((err) => {
		log('error');
		throw err;
	});
});

// post payment/succeeded
router.post('/payment/succeeded', (req, res) => {
	log('POST request received for /subscribe/payment/succeeded...');
	let data = req.body.data.object;
	if(_.has(data, 'subscription')) {
		Subscription.getSubscriptionByStripeId(
			data.subscription,
			(subscription) => {
				stripe.subscriptions.retrieve(data.subscription, (err, stripeSub) => {
					if(subscription.confirmed) {
						Subscription.updateSubscriptionEndtimeById(
							subscription.id,
							stripeSub.current_period_end
						);
					} else {
						Subscription.confirmSubscriptionById(subscription.id, (err) => {
							if(err) throw err;
						});
					}
				});
			}
		);
	}
	res.sendStatus(200);
});



/* XXX FUNCTIONS XXX */
function log(s) {
	console.log(s);
}

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		log('REQUEST AUTHENTICATED');
		return next();
	} else {
		log('REQUEST NOT AUTHENTICATED');
		req.flash('error_msg', 'Please login or signup to continue.');
		res.redirect('/accounts/login');
	}
}



/* XXX EXPORTS XXX */
module.exports = router;
