create table if not exists account_deletion_requests (
    id bigserial primary key,
    user_id bigint not null references users(id),
    role varchar(50) not null,
    reason varchar(1000) not null,
    status varchar(30) not null,
    created_at timestamptz not null default now(),
    reviewed_at timestamptz null,
    reviewed_by_user_id bigint null,
    decision_note varchar(1000) null
);

create index if not exists idx_account_deletion_requests_user_id
    on account_deletion_requests(user_id);

create unique index if not exists uq_account_deletion_requests_user_pending
    on account_deletion_requests(user_id)
    where status = 'PENDING';
