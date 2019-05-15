---------------------------------------------------------------------------------------------------
 -- Title: customer
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_19
 -- Updated: 2018_10_19

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- customer TABLE STRUCUTRE

create table if not exists customer (
	customer_id int(8) not null primary key auto_increment,
	customer_account_id_f int(8) not null,
	customer_stripe_id_f varchar(255) not null unique,
	customer_first_name varchar(255) not null,
	customer_last_name varchar(255) not null,
	customer_created_at datetime default current_timestamp()
);


-- customer TEST DATA

insert into customer (
	customer_account_id_f,
	customer_stripe_id_f,
	customer_first_name,
	customer_last_name
) values (
	0,
	'foo',
	'John',
	'Doe',
);
