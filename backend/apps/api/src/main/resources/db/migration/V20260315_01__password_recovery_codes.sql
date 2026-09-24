create table if not exists password_recovery_codes (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    phone varchar(50) not null,
    code_hash varchar(255) not null,
    status varchar(30) not null,
    attempts_left integer not null default 5,
    expires_at timestamptz not null,
    recovery_token_hash varchar(255),
    recovery_token_expires_at timestamptz,
    verified_at timestamptz,
    consumed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_password_recovery_codes_user_id
    on password_recovery_codes(user_id);

create index if not exists idx_password_recovery_codes_phone
    on password_recovery_codes(phone);

create index if not exists idx_password_recovery_codes_status
    on password_recovery_codes(status);

create index if not exists idx_password_recovery_codes_phone_status_created_at
    on password_recovery_codes(phone, status, created_at desc);
