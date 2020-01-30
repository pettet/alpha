
drop database alpha;
create database alpha;

create table alpha.stats_runtime (
	added_ts timestamp default CURRENT_TIMESTAMP primary key,
    tick_ms float,
    mem_rss float,
    cpu0_spd float, cpu0_idl float, cpu0_usr float, cpu0_nic float, cpu0_sys float, cpu0_irq float,
    cpu1_spd float, cpu1_idl float, cpu1_usr float, cpu1_nic float, cpu1_sys float, cpu1_irq float
);

create table alpha.m_ana_hits (
	id int unsigned auto_increment primary key,
	url text not null,
	ip varchar(255) not null,
	headers longtext,
	status_code smallint,
	ts timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

create table alpha.sessions (
	id int unsigned auto_increment primary key,
	ip varchar(255) not null,
	access_level smallint default -1,
	origin varchar(255),
	user_agent varchar(255),
	last_action varchar(255),
	ts_lastseen timestamp,
	ts_created timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);-- ENGINE=MEMORY;

create table alpha.blocked_ips (
	ip varchar(255) primary key,
	reason longtext,
	until_ts timestamp,
	added_ts timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);
