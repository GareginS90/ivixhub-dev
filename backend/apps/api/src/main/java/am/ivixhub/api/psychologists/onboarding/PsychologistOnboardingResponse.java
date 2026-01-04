package am.ivixhub.api.psychologists.onboarding;

import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistStatus;

public record PsychologistOnboardingResponse(
        Long psychologistId,
        Long userId,
        PsychologistStatus status,
        int experienceYears,
        String bio,
        boolean active
) {
    public static PsychologistOnboardingResponse from(Psychologist p) {
        return new PsychologistOnboardingResponse(
                p.getId(),
                p.getUser().getId(),
                p.getStatus(),
                p.getExperienceYears(),
                p.getBio(),
                p.isActive()
        );
    }
}

