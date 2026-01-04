package am.ivixhub.api.phone;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StartPhoneVerificationRequest(
        @NotBlank
        @Size(min = 5, max = 50)
        String phone
) {}
