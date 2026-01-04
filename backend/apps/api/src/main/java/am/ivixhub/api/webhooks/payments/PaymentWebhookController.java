package am.ivixhub.api.webhooks.payments;

import am.ivixhub.api.payments.webhook.PaymentWebhookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks/payments")
public class PaymentWebhookController {

    private final PaymentWebhookService service;

    public PaymentWebhookController(PaymentWebhookService service) {
        this.service = service;
    }

    /**
     * NOTE: Signatures verification will be implemented per provider.
     * For now - scaffold endpoints only.
     */
    @PostMapping("/idram")
    public ResponseEntity<Void> idram(@RequestHeader(value = "X-Idram-Event-Id", required = false) String eventId,
                                      @RequestBody String body) {
        service.handleProviderWebhook("IDRAM", eventId, body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/telcell")
    public ResponseEntity<Void> telcell(@RequestHeader(value = "X-Telcell-Event-Id", required = false) String eventId,
                                        @RequestBody String body) {
        service.handleProviderWebhook("TELCELL", eventId, body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bank-card")
    public ResponseEntity<Void> bankCard(@RequestHeader(value = "X-Bank-Event-Id", required = false) String eventId,
                                         @RequestBody String body) {
        service.handleProviderWebhook("BANK_CARD", eventId, body);
        return ResponseEntity.ok().build();
    }
}
