package am.ivixhub.bookings.domain;

public enum BookingStatus {
    CREATED,
    CONFIRMED,
    CANCELLED_BY_CLIENT,
    CANCELLED_BY_PSYCHOLOGIST,
    EXPIRED_PAYMENT,
    COMPLETED
}
