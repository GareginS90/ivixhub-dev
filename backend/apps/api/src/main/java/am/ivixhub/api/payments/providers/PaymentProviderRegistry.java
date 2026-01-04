package am.ivixhub.api.payments.providers;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PaymentProviderRegistry {

    private final Map<String, PaymentProvider> providersByName;

    public PaymentProviderRegistry(List<PaymentProvider> providers) {
        this.providersByName = providers.stream()
                .collect(Collectors.toMap(p -> p.providerName().toUpperCase(), Function.identity()));
    }

    public PaymentProvider mustGet(String providerName) {
        if (providerName == null || providerName.isBlank()) {
            throw new IllegalArgumentException("providerName is required");
        }
        PaymentProvider p = providersByName.get(providerName.trim().toUpperCase());
        if (p == null) {
            throw new IllegalArgumentException("Unknown payment provider: " + providerName);
        }
        return p;
    }
}
