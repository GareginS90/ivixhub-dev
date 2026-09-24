package am.ivixhub.api.psychologists.onboarding;

import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.users.domain.UserGender;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record PsychologistOnboardingProfileRequest(
        @Positive int experienceYears,
        @Size(min = 20, max = 2000) String bio,
        @NotNull UserGender gender,
        @NotNull Set<PsychologistLanguage> languages,
        @NotNull Set<@Size(max = 64) String> methods,
        @NotNull Set<@Size(max = 100) String> specializations
) {}
