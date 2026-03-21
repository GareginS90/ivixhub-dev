package am.ivixhub.api.publicapi.psychologists;

import java.time.OffsetDateTime;

public record PublicPsychologistReviewResponse(
        Long id,
        Integer rating,
        String comment,
        String authorDisplayName,
        OffsetDateTime createdAt
) {
}
