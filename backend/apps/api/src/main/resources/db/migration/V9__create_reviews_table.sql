create table if not exists reviews (
    id bigserial primary key,
    booking_id bigint not null,
    author_user_id bigint not null,
    subject_user_id bigint not null,
    target_role varchar(20) not null,
    rating integer not null,
    comment varchar(2000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uk_reviews_booking_author unique (booking_id, author_user_id),
    constraint chk_reviews_rating_range check (rating >= 1 and rating <= 5)
);

create index if not exists idx_reviews_booking_id on reviews (booking_id);
create index if not exists idx_reviews_author_user_id on reviews (author_user_id);
create index if not exists idx_reviews_subject_user_id on reviews (subject_user_id);
create index if not exists idx_reviews_target_role on reviews (target_role);
create index if not exists idx_reviews_created_at on reviews (created_at);
