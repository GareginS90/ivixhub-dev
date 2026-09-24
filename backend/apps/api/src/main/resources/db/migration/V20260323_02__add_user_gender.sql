alter table users
    add column if not exists gender varchar(20);

update users
set gender = 'UNSPECIFIED'
where gender is null or trim(gender) = '';

alter table users
    alter column gender set not null;

alter table users
    drop constraint if exists chk_users_gender_allowed;

alter table users
    add constraint chk_users_gender_allowed
    check (gender in ('MALE', 'FEMALE', 'UNSPECIFIED'));
