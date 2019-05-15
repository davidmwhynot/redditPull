---------------------------------------------------------------------------------------------------
 -- Title: subscription
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_18
 -- Updated: 2018_10_18

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- subscription TABLE STRUCUTRE

create table if not exists subscription (
	subscription_id int(8) not null primary key auto_increment,
	subscription_account_id_f int(8) not null,
	subscription_stripe_id VARCHAR(255) not null collate utf8_bin,
	subscription_type tinyint(1) not null,
	subscription_endtime int(64) not null,
	subscription_confirmed boolean default false
);


-- subscription TEST DATA

insert into subscription (
	subscription_account_id_f,
	subscription_stripe_id,
	subscription_type,
	subscription_endtime
) values (
	0,
	'sub_Do4AlNoN7MNoyI',
	1,
	1542511140
);
