---------------------------------------------------------------------------------------------------
 -- Title: sessions
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: redditpull

 -- Created: 2018_10_18
 -- Updated: 2018_10_18

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- sessions TABLE STRUCUTRE

CREATE TABLE IF NOT EXISTS sessions (
  session_id varchar(128) not null primary key collate utf8mb4_bin,
  expires int(11) unsigned not null,
  data text collate utf8mb4_bin
) ENGINE=InnoDB;
