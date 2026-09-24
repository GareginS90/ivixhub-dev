package am.ivixhub.api.auth;

import am.ivixhub.users.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @Email @NotBlank String email,
        @NotBlank String password,
        @NotNull UserRole role
) {}
