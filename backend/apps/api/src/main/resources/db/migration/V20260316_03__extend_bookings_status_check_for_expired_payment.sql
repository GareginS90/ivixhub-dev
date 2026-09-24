alter table bookings
    drop constraint if exists bookings_status_check;

alter table bookings
    add constraint bookings_status_check
    check (
        status in (
            'CREATED',
            'CONFIRMED',
            'CANCELLED_BY_CLIENT',
            'CANCELLED_BY_PSYCHOLOGIST',
            'EXPIRED_PAYMENT',
            'COMPLETED'
        )
    );
