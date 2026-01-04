package am.ivixhub.api.payments;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.api.escrow.EscrowOrchestratorService;
import am.ivixhub.api.notifications.NotificationEventService;
import am.ivixhub.api.payments.methods.CreatePaymentIntentRequest;
import am.ivixhub.api.payments.policy.PaymentMethodPolicyService;
import am.ivixhub.api.payments.providers.PaymentProviderRegistry;
import am.ivixhub.api.payments.providers.PaymentProviderSelector;
import am.ivixhub.api.payments.providers.PaymentProviderType;
import am.ivixhub.api.payments.providers.PaymentProvider;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.payments.domain.PaymentEvent;
import am.ivixhub.payments.domain.PaymentIntent;
import am.ivixhub.payments.domain.PaymentStatus;
import am.ivixhub.payments.repository.PaymentEventRepository;
import am.ivixhub.payments.repository.PaymentIntentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentIntentRepository paymentIntentRepository;
    private final PaymentEventRepository paymentEventRepository;

    private final NotificationEventService notificationEvents;
    private final AuditService auditService;
    private final EscrowOrchestratorService escrowOrchestrator;
    private final PaymentProviderRegistry providerRegistry;
    private final PaymentProviderSelector selector;
    private final PaymentMethodPolicyService policy;

    public PaymentService(BookingRepository bookingRepository,
                          PaymentIntentRepository paymentIntentRepository,
                          PaymentEventRepository paymentEventRepository,
                          NotificationEventService notificationEvents,
                          AuditService auditService,
                          EscrowOrchestratorService escrowOrchestrator,
                          PaymentProviderRegistry providerRegistry,
                          PaymentProviderSelector selector,
                          PaymentMethodPolicyService policy) {
        this.bookingRepository = bookingRepository;
        this.paymentIntentRepository = paymentIntentRepository;
        this.paymentEventRepository = paymentEventRepository;
        this.notificationEvents = notificationEvents;
        this.auditService = auditService;
        this.escrowOrchestrator = escrowOrchestrator;
        this.providerRegistry = providerRegistry;
        this.selector = selector;
        this.policy = policy;
    }

    @Transactional
    public PaymentIntent createIntent(Long clientUserId, Long bookingId, CreatePaymentIntentRequest req) {
        // ✅ policy first (best practice)
        policy.assertAllowed(req.method());

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getClientUserId().equals(clientUserId)) {
            throw new IllegalArgumentException("Not your booking");
        }
        if (booking.getStatus() != BookingStatus.CREATED) {
            throw new IllegalArgumentException("Payment allowed only for CREATED bookings");
        }

        long amountMinor = 1_000_000;
        String currency = "AMD";

        PaymentProviderType providerType = selector.select(req.method());
        String providerName = providerType.name();

        PaymentIntent pi = new PaymentIntent();
        pi.setBookingId(bookingId);
        pi.setClientUserId(clientUserId);
        pi.setAmountMinor(amountMinor);
        pi.setCurrency(currency);
        pi.setStatus(PaymentStatus.INITIATED);
        pi.setProvider(providerName);

        PaymentIntent saved = paymentIntentRepository.save(pi);

        PaymentProvider provider = providerRegistry.mustGet(providerName);
        var checkout = provider.createCheckout(new PaymentProvider.CreateCheckoutRequest(
                saved.getId(),
                bookingId,
                clientUserId,
                amountMinor,
                currency,
                req.returnUrl()
        ));

        saved.setProviderPaymentId(checkout.providerPaymentId());
        saved.setCheckoutUrl(checkout.checkoutUrl());
        saved = paymentIntentRepository.save(saved);

        logEvent(saved.getId(), saved.getProvider(), "INTENT_CREATED", saved.getProviderPaymentId(), null);

        auditService.log(
                clientUserId,
                "PAYMENT_INTENT_CREATED",
                "Booking",
                bookingId,
                "paymentIntentId=" + saved.getId() +
                        " provider=" + saved.getProvider() +
                        " providerPaymentId=" + saved.getProviderPaymentId() +
                        " amountMinor=" + amountMinor +
                        " currency=" + currency,
                null,
                null
        );

        return saved;
    }

    @Transactional(readOnly = true)
    public PaymentIntent getIntentById(Long clientUserId, Long paymentIntentId) {
        PaymentIntent pi = paymentIntentRepository.findById(paymentIntentId)
                .orElseThrow(() -> new IllegalArgumentException("PaymentIntent not found"));

        if (!pi.getClientUserId().equals(clientUserId)) {
            throw new IllegalArgumentException("Not your payment intent");
        }
        return pi;
    }

    @Transactional(readOnly = true)
    public PaymentIntent getLatestIntentForBooking(Long clientUserId, Long bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getClientUserId().equals(clientUserId)) {
            throw new IllegalArgumentException("Not your booking");
        }

        return paymentIntentRepository.findTopByBookingIdOrderByIdDesc(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("PaymentIntent not found"));
    }

    @Transactional
    public void mockPay(Long clientUserId, Long bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getClientUserId().equals(clientUserId)) {
            throw new IllegalArgumentException("Not your booking");
        }

        var pi = paymentIntentRepository.findTopByBookingIdOrderByIdDesc(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("PaymentIntent not found"));

        if (pi.getStatus() != PaymentStatus.INITIATED) {
            throw new IllegalArgumentException("PaymentIntent is not payable");
        }

        pi.setStatus(PaymentStatus.PAID);
        paymentIntentRepository.save(pi);

        logEvent(pi.getId(), pi.getProvider(), "PAID_MOCK", pi.getProviderPaymentId(), null);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        escrowOrchestrator.createHold(
                bookingId,
                booking.getPsychologistId(),
                clientUserId,
                pi.getAmountMinor(),
                pi.getCurrency(),
                booking.getEndAt().plusDays(3)
        );

        notificationEvents.bookingConfirmed(clientUserId, bookingId);

        auditService.log(
                clientUserId,
                "PAYMENT_PAID_MOCK",
                "Booking",
                bookingId,
                "paymentIntentId=" + pi.getId() + " bookingStatus=CONFIRMED escrow=HOLD",
                null,
                null
        );
    }

    @Transactional
    public void confirmPaidFromWebhook(String provider, String providerPaymentId, String providerEventId, String payloadHash) {
        if (providerPaymentId == null || providerPaymentId.isBlank()) {
            throw new IllegalArgumentException("providerPaymentId is required");
        }

        PaymentIntent pi = paymentIntentRepository.findByProviderPaymentId(providerPaymentId)
                .orElseThrow(() -> new IllegalArgumentException("PaymentIntent not found for providerPaymentId=" + providerPaymentId));

        if (pi.getStatus() == PaymentStatus.PAID) {
            logEvent(pi.getId(), provider, "WEBHOOK_DUPLICATE", providerEventId, payloadHash);
            return;
        }

        pi.setStatus(PaymentStatus.PAID);
        paymentIntentRepository.save(pi);

        logEvent(pi.getId(), provider, "WEBHOOK_CONFIRMED_PAID", providerEventId, payloadHash);

        var booking = bookingRepository.findById(pi.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CREATED) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            escrowOrchestrator.createHold(
                    booking.getId(),
                    booking.getPsychologistId(),
                    pi.getClientUserId(),
                    pi.getAmountMinor(),
                    pi.getCurrency(),
                    booking.getEndAt().plusDays(3)
            );

            notificationEvents.bookingConfirmed(pi.getClientUserId(), booking.getId());

            auditService.log(
                    pi.getClientUserId(),
                    "PAYMENT_PAID_WEBHOOK",
                    "Booking",
                    booking.getId(),
                    "provider=" + provider + " providerPaymentId=" + providerPaymentId,
                    null,
                    null
            );
        }
    }

    @Transactional
    public EscrowStatus releaseEscrowIfEligible(Long psychologistId, Long bookingId) {
        return escrowOrchestrator.releaseIfEligible(psychologistId, bookingId);
    }

    @Transactional
    public void logWebhookEvent(String provider, String providerEventId, String payloadHash) {
        PaymentEvent e = new PaymentEvent();
        e.setPaymentIntentId(null);
        e.setProvider(provider);
        e.setEventType("WEBHOOK_RECEIVED");
        e.setProviderEventId(providerEventId);
        e.setPayloadHash(payloadHash);
        paymentEventRepository.save(e);
    }

    private void logEvent(Long paymentIntentId, String provider, String eventType, String providerEventId, String payloadHash) {
        PaymentEvent e = new PaymentEvent();
        e.setPaymentIntentId(paymentIntentId);
        e.setProvider(provider);
        e.setEventType(eventType);
        e.setProviderEventId(providerEventId);
        e.setPayloadHash(payloadHash);
        paymentEventRepository.save(e);
    }
}

