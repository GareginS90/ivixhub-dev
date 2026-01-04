package am.ivixhub.api.payments.providers;

public interface PaymentProvider {

    record CreateCheckoutRequest(
            Long paymentIntentId,
            Long bookingId,
            Long clientUserId,
            long amountMinor,
            String currency,
            String returnUrl
    ) {}

    record CreateCheckoutResult(
            String providerName,
            String providerPaymentId,
            String checkoutUrl
    ) {}

    String providerName();

    /**
     * Create provider-side payment object (hosted checkout / payment intent / invoice).
     * Returns providerPaymentId + optional checkoutUrl.
     */
    CreateCheckoutResult createCheckout(CreateCheckoutRequest req);
}
