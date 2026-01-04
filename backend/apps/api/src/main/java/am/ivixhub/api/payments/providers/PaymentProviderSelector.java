package am.ivixhub.api.payments.providers;

import am.ivixhub.api.payments.methods.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
public class PaymentProviderSelector {

    public PaymentProviderType select(PaymentMethod method) {
        if (method == null) throw new IllegalArgumentException("method is required");
        return switch (method) {
            case CARD -> PaymentProviderType.BANK_CARD;
            case IDRAM -> PaymentProviderType.IDRAM;
            case TELCELL -> PaymentProviderType.TELCELL;
        };
    }
}
