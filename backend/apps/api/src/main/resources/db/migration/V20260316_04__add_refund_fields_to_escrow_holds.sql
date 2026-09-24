alter table escrow_holds
    add column if not exists refund_percent integer,
    add column if not exists refunded_amount_minor bigint,
    add column if not exists refunded_at timestamptz;
