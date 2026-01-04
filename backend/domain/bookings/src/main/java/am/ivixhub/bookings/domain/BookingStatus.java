package am.ivixhub.bookings.domain;

public enum BookingStatus {
    CREATED,            // создано, еще не оплачено (позже)
    CONFIRMED,          // подтверждено (после оплаты)
    CANCELLED_BY_CLIENT,
    CANCELLED_BY_PSYCHOLOGIST,
    COMPLETED
}
