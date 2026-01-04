package am.ivixhub.api.psychologists.onboarding;

import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.TherapyMethod;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record PsychologistOnboardingUpdateRequest(
        @NotNull @Min(0) @Max(80) Integer experienceYears,
        @Size(max = 2000) String bio,
        @NotNull Set<PsychologistLanguage> languages,
        @NotNull Set<TherapyMethod> methods,
        @NotNull Set<@Size(max = 100) String> specializations
) {}

