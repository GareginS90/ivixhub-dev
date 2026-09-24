alter table users
    add column if not exists full_name varchar(150),
    add column if not exists username varchar(50),
    add column if not exists birth_date date;

update users
set username = 'user_' || id
where username is null or trim(username) = '';

update users
set birth_date = date '1995-01-01'
where birth_date is null;

create unique index if not exists uq_users_username
    on users(username);

alter table users
    alter column username set not null,
    alter column birth_date set not null;

alter table users
    drop constraint if exists chk_users_birth_date_range;

alter table users
    add constraint chk_users_birth_date_range
    check (birth_date between date '1940-01-01' and date '2010-12-31');
