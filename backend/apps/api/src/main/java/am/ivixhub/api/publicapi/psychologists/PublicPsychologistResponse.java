package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.users.domain.UserGender;

import java.time.OffsetDateTime;
import java.util.Set;

public record PublicPsychologistResponse(
        Long psychologistId,
        int experienceYears,
        String bio,
        OffsetDateTime verifiedAt,
        String displayName,
        Set<PsychologistLanguage> languages,
        Integer age,
        UserGender gender,
        String avatarUrl,
        Double ratingAvg,
        Integer reviewsCount
) {}
