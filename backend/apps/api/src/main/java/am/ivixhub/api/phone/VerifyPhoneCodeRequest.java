package am.ivixhub.api.phone;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerifyPhoneCodeRequest(
        @NotBlank
        @Size(min = 4, max = 8)
        String code
) {}
