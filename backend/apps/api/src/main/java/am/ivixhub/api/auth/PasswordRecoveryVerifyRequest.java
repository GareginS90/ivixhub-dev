package am.ivixhub.api.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordRecoveryVerifyRequest(
        @NotBlank String phone,
        @NotBlank String code
) {}
