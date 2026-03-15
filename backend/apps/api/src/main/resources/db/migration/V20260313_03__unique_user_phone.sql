update users
set phone = null
where phone is not null and trim(phone) = '';

create unique index if not exists uq_users_phone
    on users(phone)
    where phone is not null;
