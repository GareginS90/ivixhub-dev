package am.ivixhub.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordRecoveryResetRequest(
        @NotBlank String phone,
        @NotBlank String recoveryToken,
        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,100}$",
                message = "Password must contain at least 8 characters, 1 letter, 1 digit and 1 special symbol"
        )
        String password
) {}
