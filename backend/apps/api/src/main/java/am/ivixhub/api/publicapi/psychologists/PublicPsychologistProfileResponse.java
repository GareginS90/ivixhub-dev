package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.users.domain.UserGender;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

public record PublicPsychologistProfileResponse(
        Long psychologistId,
        String displayName,
        int experienceYears,
        String bio,
        Set<PsychologistLanguage> languages,
        Set<String> methods,
        Set<String> specializations,
        Integer age,
        UserGender gender,
        String avatarUrl,
        OffsetDateTime verifiedAt,
        Double ratingAvg,
        Integer reviewsCount,
        List<PublicPsychologistReviewResponse> recentReviews
) {
}
