package am.ivixhub.api.payments.providers;

import org.springframework.stereotype.Component;

@Component
public class MockPaymentProvider implements PaymentProvider {

    @Override
    public String providerName() {
        return "MOCK";
    }

    @Override
    public CreateCheckoutResult createCheckout(CreateCheckoutRequest req) {
        // No redirect needed for mock. We only generate a ref for tracing.
        String providerPaymentId = "mock-pay-" + req.paymentIntentId();
        return new CreateCheckoutResult(providerName(), providerPaymentId, null);
    }
}
