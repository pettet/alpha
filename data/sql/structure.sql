
drop database alpha;
create database alpha;

create table alpha.m_ana_hits (
	id int unsigned auto_increment primary key,
	url text not null,
	ip varchar(255) not null,
	headers longtext,
	status_code smallint,
	ts timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

create table alpha.blocked_ips (
	ip varchar(255) primary key,
	reason longtext,
	until_ts timestamp,
	added_ts timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);
