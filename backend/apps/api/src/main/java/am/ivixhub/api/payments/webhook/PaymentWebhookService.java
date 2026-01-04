package am.ivixhub.api.payments.webhook;

import am.ivixhub.api.payments.PaymentService;
import am.ivixhub.payments.repository.PaymentEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentWebhookService {

    private final PaymentEventRepository eventRepository;
    private final PaymentService paymentService;

    private static final Pattern PROVIDER_PAYMENT_ID = Pattern.compile("\"providerPaymentId\"\\s*:\\s*\"([^\"]+)\"");

    public PaymentWebhookService(PaymentEventRepository eventRepository, PaymentService paymentService) {
        this.eventRepository = eventRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public void handleProviderWebhook(String provider, String providerEventId, String body) {
        String payload = body == null ? "" : body;
        String payloadHash = sha256Hex(payload);

        // idempotency by providerEventId
        if (providerEventId != null && !providerEventId.isBlank()) {
            if (eventRepository.existsByProviderEventId(providerEventId)) {
                return;
            }
        }

        // log receipt
        paymentService.logWebhookEvent(provider, providerEventId, payloadHash);

        // parse providerPaymentId from JSON
        String providerPaymentId = extractProviderPaymentId(payload);

        // confirm payment (prod-style)
        paymentService.confirmPaidFromWebhook(provider, providerPaymentId, providerEventId, payloadHash);
    }

    private String extractProviderPaymentId(String payload) {
        Matcher m = PROVIDER_PAYMENT_ID.matcher(payload);
        if (m.find()) return m.group(1);
        throw new IllegalArgumentException("providerPaymentId missing in webhook payload");
    }

    private String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] out = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : out) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("sha256 failed", e);
        }
    }
}

