---------------------------------------------------------------------------------------------------
 -- Title: address
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_19
 -- Updated: 2018_10_19

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- address TABLE STRUCUTRE

create table if not exists address (
	address_id int(8) not null primary key auto_increment,
	address_customer_id_f int(8) not null,
	address_line_1 varchar(255) not null,
	address_line_2 varchar(255) not null,
	address_city varchar(255) not null,
	address_state varchar(255) not null,
	address_country varchar(255) not null,
	address_zip varchar(255) not null
	account_created_at datetime default current_timestamp()
);
