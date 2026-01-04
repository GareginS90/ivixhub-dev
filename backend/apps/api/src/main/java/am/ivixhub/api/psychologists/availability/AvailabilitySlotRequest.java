package am.ivixhub.api.psychologists.availability;

import am.ivixhub.psychologists.domain.WeekDay;
import jakarta.validation.constraints.NotNull;

public record AvailabilitySlotRequest(
        @NotNull WeekDay dayOfWeek,
        @NotNull String startTimeUtc, // "10:00"
        @NotNull String endTimeUtc    // "18:00"
) {}
