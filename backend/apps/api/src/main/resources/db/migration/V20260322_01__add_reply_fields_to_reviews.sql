alter table reviews
    add column if not exists reply_comment varchar(2000),
    add column if not exists reply_author_user_id bigint,
    add column if not exists replied_at timestamptz;

create index if not exists idx_reviews_reply_author_user_id
    on reviews(reply_author_user_id);

create index if not exists idx_reviews_replied_at
    on reviews(replied_at);
