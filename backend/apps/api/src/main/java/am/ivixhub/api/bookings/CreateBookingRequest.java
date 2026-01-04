package am.ivixhub.api.bookings;

import am.ivixhub.bookings.domain.SessionType;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record CreateBookingRequest(
        @NotNull Long psychologistId,
        @NotNull SessionType sessionType,
        @NotNull OffsetDateTime startAtUtc,
        @NotNull OffsetDateTime endAtUtc
) {}
