package am.ivixhub.api.bookings;

import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.domain.SessionType;

import java.time.OffsetDateTime;

public record BookingResponse(
        Long id,
        Long clientUserId,
        Long psychologistId,
        SessionType sessionType,
        OffsetDateTime startAtUtc,
        OffsetDateTime endAtUtc,
        BookingStatus status
) {}
