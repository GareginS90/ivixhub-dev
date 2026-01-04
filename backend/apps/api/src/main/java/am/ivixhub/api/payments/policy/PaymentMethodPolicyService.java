package am.ivixhub.api.payments.policy;

import am.ivixhub.api.payments.methods.PaymentMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PaymentMethodPolicyService {

    private final Set<PaymentMethod> allowed;

    public PaymentMethodPolicyService(@Value("${ivixhub.payments.allowedMethods:CARD,IDRAM,TELCELL}") String allowedCsv) {
        this.allowed = parseAllowed(allowedCsv);
    }

    public void assertAllowed(PaymentMethod method) {
        if (method == null) throw new IllegalArgumentException("method is required");
        if (!allowed.contains(method)) {
            throw new IllegalArgumentException("Payment method is disabled: " + method);
        }
    }

    public Set<PaymentMethod> getAllowed() {
        return EnumSet.copyOf(allowed);
    }

    private Set<PaymentMethod> parseAllowed(String csv) {
        if (csv == null || csv.isBlank()) {
            return EnumSet.of(PaymentMethod.CARD);
        }

        return Arrays.stream(csv.split(","))
                .map(s -> s.trim().toUpperCase(Locale.ROOT))
                .filter(s -> !s.isBlank())
                .map(PaymentMethod::valueOf)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(PaymentMethod.class)));
    }
}
