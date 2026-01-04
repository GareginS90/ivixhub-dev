package am.ivixhub.api.payments.providers;

import org.springframework.stereotype.Component;

@Component
public class TelcellPaymentProvider implements PaymentProvider {

    @Override
    public String providerName() {
        return "TELCELL";
    }

    @Override
    public CreateCheckoutResult createCheckout(CreateCheckoutRequest req) {
        // Stub: later generate Telcell checkout URL + payment id.
        String providerPaymentId = "telcell-pay-" + req.paymentIntentId();
        String checkoutUrl = null;
        return new CreateCheckoutResult(providerName(), providerPaymentId, checkoutUrl);
    }
}
