package am.ivixhub.api.psychologists.onboarding;

import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.users.domain.UserGender;

import java.util.Set;

public record PsychologistOnboardingResponse(
        Long psychologistId,
        Long userId,
        PsychologistStatus status,
        int experienceYears,
        String bio,
        UserGender gender,
        Set<PsychologistLanguage> languages,
        Set<String> methods,
        Set<String> specializations,
        String avatarUrl,
        boolean active
) {
    public static PsychologistOnboardingResponse from(Psychologist p, String avatarUrl) {
        return new PsychologistOnboardingResponse(
                p.getId(),
                p.getUser().getId(),
                p.getStatus(),
                p.getExperienceYears(),
                p.getBio(),
                p.getUser().getGender(),
                p.getLanguages(),
                p.getMethods(),
                p.getSpecializations(),
                avatarUrl,
                p.isActive()
        );
    }
}
