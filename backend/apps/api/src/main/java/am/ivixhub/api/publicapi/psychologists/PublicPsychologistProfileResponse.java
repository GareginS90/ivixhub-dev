package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.psychologists.domain.PsychologistLanguage;

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
        OffsetDateTime verifiedAt,
        Double ratingAvg,
        Integer reviewsCount,
        List<PublicPsychologistReviewResponse> recentReviews
) {
}
