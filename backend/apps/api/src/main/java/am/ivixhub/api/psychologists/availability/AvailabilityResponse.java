package am.ivixhub.api.psychologists.availability;

import am.ivixhub.psychologists.domain.WeekDay;

public record AvailabilityResponse(
        Long id,
        Long psychologistId,
        WeekDay dayOfWeek,
        String startTimeUtc,
        String endTimeUtc
) {}
