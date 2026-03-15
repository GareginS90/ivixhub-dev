alter table bookings
    add column if not exists session_language varchar(10) not null default 'HY';
