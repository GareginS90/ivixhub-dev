package am.ivixhub.api.payments;

import am.ivixhub.api.payments.methods.CreatePaymentIntentRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/intent/{bookingId}")
    public PaymentIntentResponse createIntent(Authentication auth,
                                              @PathVariable("bookingId") Long bookingId,
                                              @Valid @RequestBody CreatePaymentIntentRequest req) {
        Long clientUserId = (Long) auth.getPrincipal();
        return PaymentIntentResponse.from(paymentService.createIntent(clientUserId, bookingId, req));
    }

    @GetMapping("/intents/{paymentIntentId}")
    public PaymentIntentResponse getById(Authentication auth, @PathVariable("paymentIntentId") Long paymentIntentId) {
        Long clientUserId = (Long) auth.getPrincipal();
        return PaymentIntentResponse.from(paymentService.getIntentById(clientUserId, paymentIntentId));
    }

    @GetMapping("/bookings/{bookingId}/intent/latest")
    public PaymentIntentResponse getLatestByBooking(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long clientUserId = (Long) auth.getPrincipal();
        return PaymentIntentResponse.from(paymentService.getLatestIntentForBooking(clientUserId, bookingId));
    }

    @PostMapping("/mock/pay/{bookingId}")
    public void mockPay(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long clientUserId = (Long) auth.getPrincipal();
        paymentService.mockPay(clientUserId, bookingId);
    }

    public record PaymentIntentResponse(
            Long paymentIntentId,
            Long bookingId,
            long amountMinor,
            String currency,
            String provider,
            String providerPaymentId,
            String checkoutUrl,
            String status
    ) {
        public static PaymentIntentResponse from(am.ivixhub.payments.domain.PaymentIntent pi) {
            return new PaymentIntentResponse(
                    pi.getId(),
                    pi.getBookingId(),
                    pi.getAmountMinor(),
                    pi.getCurrency(),
                    pi.getProvider(),
                    pi.getProviderPaymentId(),
                    pi.getCheckoutUrl(),
                    pi.getStatus().name()
            );
        }
    }
}

