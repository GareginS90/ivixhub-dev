package am.ivixhub.api.payments.methods;

import jakarta.validation.constraints.NotNull;

public record CreatePaymentIntentRequest(
        @NotNull PaymentMethod method,
        String returnUrl // optional (web/mobile deep link later)
) {}
