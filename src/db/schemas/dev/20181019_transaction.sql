---------------------------------------------------------------------------------------------------
 -- Title: transaction
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_19
 -- Updated: 2018_10_19

 -- VERSION --
 -- v1.1.0 --
---------------------------------------------------------------------------------------------------


-- transaction TABLE STRUCUTRE

create table if not exists transaction (
	transaction_id varchar(255) not null primary key,
	transaction_customer_id_f int(8) not null,
	transaction_card_id_f int(8) not null,
	transaction_subscription_id_f int(8) not null,
	transaction_stripe_id_f varchar(255) not null,
	transaction_desc varchar(255) not null,
	transaction_currency varchar(255),
	transaction_amount int(64) not null,
	transaction_status varchar(255),
	transaction_created_at datetime default current_timestamp
);
