package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.psychologists.domain.PsychologistLanguage;

import java.time.OffsetDateTime;
import java.util.Set;

public record PublicPsychologistProfileResponse(
        Long psychologistId,
        int experienceYears,
        String bio,
        Set<PsychologistLanguage> languages,
        Set<String> methods,
        Set<String> specializations,
        OffsetDateTime verifiedAt
) {}

