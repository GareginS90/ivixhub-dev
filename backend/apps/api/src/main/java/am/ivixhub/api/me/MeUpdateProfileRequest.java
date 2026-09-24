package am.ivixhub.api.me;

import am.ivixhub.users.domain.UserGender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MeUpdateProfileRequest(
        @Size(max = 150) String fullName,
        @NotBlank
        @Size(min = 3, max = 50)
        @Pattern(regexp = "^[a-zA-Z0-9._]+$", message = "Username may contain only letters, numbers, dot and underscore")
        String username,
        @NotNull LocalDate birthDate,
        @NotNull UserGender gender
) {}
