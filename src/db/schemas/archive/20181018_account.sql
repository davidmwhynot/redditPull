---------------------------------------------------------------------------------------------------
 -- Title: account
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_09_19
 -- Updated: 2018_10_18

 -- VERSION --
 -- v1.2.0 --
---------------------------------------------------------------------------------------------------


-- account TABLE STRUCUTRE

create table if not exists account (
	account_id int(8) not null primary key auto_increment,
	account_email varchar(250) not null unique,
	account_auth varchar(60) not null
);


-- account TEST DATA

insert into account (
	account_email,
	account_auth
) values (
	'example@gmail.com',
	'$2a$10$GmlGOagVQWVOFETLylgra.RO02PkBcD9rvjXTCKyfpmaGhTaCkByO'
);
