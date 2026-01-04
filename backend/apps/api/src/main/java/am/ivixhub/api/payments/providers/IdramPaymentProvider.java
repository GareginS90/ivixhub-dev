package am.ivixhub.api.payments.providers;

import org.springframework.stereotype.Component;

@Component
public class IdramPaymentProvider implements PaymentProvider {

    @Override
    public String providerName() {
        return "IDRAM";
    }

    @Override
    public CreateCheckoutResult createCheckout(CreateCheckoutRequest req) {
        // Stub: later generate Idram checkout URL + payment id.
        String providerPaymentId = "idram-pay-" + req.paymentIntentId();
        String checkoutUrl = null;
        return new CreateCheckoutResult(providerName(), providerPaymentId, checkoutUrl);
    }
}
