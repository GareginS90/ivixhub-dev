package am.ivixhub.api.psychologists.profile;

import am.ivixhub.psychologists.domain.PsychologistLanguage;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record PsychologistProfileUpdateRequest(
        @Size(max = 2000) String bio,
        @NotNull Set<PsychologistLanguage> languages,
        @NotNull Set<@Size(max = 64) String> methods,
        @NotNull Set<@Size(max = 100) String> specializations
) {}

