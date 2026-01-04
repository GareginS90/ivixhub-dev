package am.ivixhub.api.admin.psychologists;

import am.ivixhub.psychologists.domain.PsychologistStatus;

import java.time.OffsetDateTime;

public record AdminPsychologistDecisionResponse(
        Long psychologistId,
        Long userId,
        String email,
        String phone,
        boolean phoneVerified,
        PsychologistStatus status,
        OffsetDateTime submittedAt,
        OffsetDateTime verifiedAt,
        Long reviewedByUserId,
        OffsetDateTime reviewedAt,
        String rejectionReason
) {}
