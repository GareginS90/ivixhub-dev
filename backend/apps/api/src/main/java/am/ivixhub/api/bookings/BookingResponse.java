package am.ivixhub.api.bookings;

import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.domain.SessionLanguage;
import am.ivixhub.bookings.domain.SessionType;
import am.ivixhub.users.domain.UserGender;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record BookingResponse(
        Long id,
        Long clientUserId,
        Long psychologistId,
        String clientDisplayName,
        String clientUsername,
        LocalDate clientBirthDate,
        UserGender clientGender,
        OffsetDateTime startAtUtc,
        OffsetDateTime endAtUtc,
        SessionType type,
        SessionLanguage language,
        BookingStatus status
) {}
