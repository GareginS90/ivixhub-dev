package am.ivixhub.api.payments.providers;

import org.springframework.stereotype.Component;

@Component
public class BankCardPaymentProvider implements PaymentProvider {

    @Override
    public String providerName() {
        return "BANK_CARD";
    }

    @Override
    public CreateCheckoutResult createCheckout(CreateCheckoutRequest req) {
        // Stub: in real life, you will create hosted payment / 3DS flow via bank gateway.
        // For now we return providerPaymentId only.
        String providerPaymentId = "bankcard-pay-" + req.paymentIntentId();
        String checkoutUrl = null;
        return new CreateCheckoutResult(providerName(), providerPaymentId, checkoutUrl);
    }
}
