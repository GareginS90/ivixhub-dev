package am.ivixhub.api.publicapi.psychologists;

import java.time.OffsetDateTime;

public record PublicPsychologistResponse(
        Long psychologistId,
        int experienceYears,
        String bio,
        OffsetDateTime verifiedAt
) {}

