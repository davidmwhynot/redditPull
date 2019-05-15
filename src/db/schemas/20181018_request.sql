---------------------------------------------------------------------------------------------------
 -- Title: request
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_18
 -- Updated: 2018_10_18

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- request TABLE STRUCUTRE

create table if not exists request (
	request_id int(8) not null primary key auto_increment,
	request_account_id_f int(8) not null,
	request_time int(64) not null,
	request_sub varchar(255) not null
);


-- request TEST DATA

insert into request (
	request_account_id_f,
	request_time,
	request_sub
) values (
	'1',
	0,
	'pics'
);
