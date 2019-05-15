---------------------------------------------------------------------------------------------------
 -- Title: card
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_19
 -- Updated: 2018_10_19

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- card TABLE STRUCUTRE

create table if not exists card (
	card_id int(8) not null primary key auto_increment,
	card_customer_id_f int(8) not null,
	card_stripe_id_f varchar(255) not null,
	card_zip varchar(255) not null,
	card_country varchar(255) not null,
	card_exp_month tinyint(2) not null,
	card_exp_year int(4) not null,
	card_last_four int(4) not null,
	card_funding varchar(255) not null,
	card_created_at datetime default current_timestamp()
);
