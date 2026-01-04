package am.ivixhub.api.admin.psychologists;

import am.ivixhub.psychologists.domain.PsychologistStatus;

import java.time.OffsetDateTime;

public record PendingPsychologistResponse(
        Long psychologistId,
        Long userId,
        String email,
        String phone,
        boolean phoneVerified,
        PsychologistStatus status,
        int experienceYears,
        String bio,
        OffsetDateTime submittedAt
) {}
