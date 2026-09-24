alter table notifications
    add column if not exists related_booking_id bigint;

create index if not exists idx_notif_related_booking_id
    on notifications(related_booking_id);
