package am.ivixhub.payments.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "payment_events",
        indexes = {
                @Index(name = "idx_pe_payment_intent_id", columnList = "payment_intent_id"),
                @Index(name = "idx_pe_provider_event_id", columnList = "provider_event_id")
        })
public class PaymentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nullable at WEBHOOK_RECEIVED stage (before mapping).
     */
    @Column(name = "payment_intent_id")
    private Long paymentIntentId;

    @Column(nullable = false, length = 40)
    private String provider;

    @Column(name = "event_type", nullable = false, length = 60)
    private String eventType;

    @Column(name = "provider_event_id", length = 128)
    private String providerEventId;

    @Column(name = "payload_hash", length = 128)
    private String payloadHash;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }

    public Long getPaymentIntentId() { return paymentIntentId; }
    public void setPaymentIntentId(Long paymentIntentId) { this.paymentIntentId = paymentIntentId; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getProviderEventId() { return providerEventId; }
    public void setProviderEventId(String providerEventId) { this.providerEventId = providerEventId; }

    public String getPayloadHash() { return payloadHash; }
    public void setPayloadHash(String payloadHash) { this.payloadHash = payloadHash; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
}

