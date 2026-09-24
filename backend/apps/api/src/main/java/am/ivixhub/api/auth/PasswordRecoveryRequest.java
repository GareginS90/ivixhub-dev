package am.ivixhub.api.auth;

import am.ivixhub.users.domain.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PasswordRecoveryRequest(
        @NotBlank String phone,
        @NotNull UserRole role
) {}
