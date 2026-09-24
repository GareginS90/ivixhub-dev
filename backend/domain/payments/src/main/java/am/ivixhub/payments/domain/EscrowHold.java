package am.ivixhub.payments.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "escrow_holds",
        indexes = {
                @Index(name = "idx_eh_booking_id", columnList = "booking_id"),
                @Index(name = "idx_eh_psychologist_id", columnList = "psychologist_id"),
                @Index(name = "idx_eh_status", columnList = "status")
        })
public class EscrowHold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="booking_id", nullable = false, unique = true)
    private Long bookingId;

    @Column(name="psychologist_id", nullable = false)
    private Long psychologistId;

    @Column(name="amount_minor", nullable = false)
    private long amountMinor;

    @Column(name="currency", nullable = false, length = 10)
    private String currency = "AMD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EscrowStatus status = EscrowStatus.HOLD;

    @Column(name="refund_percent")
    private Integer refundPercent;

    @Column(name="refunded_amount_minor")
    private Long refundedAmountMinor;

    @Column(name="refunded_at")
    private OffsetDateTime refundedAt;

    @Column(name="hold_until", nullable = false)
    private OffsetDateTime holdUntil;

    @Column(name="created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getPsychologistId() { return psychologistId; }
    public void setPsychologistId(Long psychologistId) { this.psychologistId = psychologistId; }

    public long getAmountMinor() { return amountMinor; }
    public void setAmountMinor(long amountMinor) { this.amountMinor = amountMinor; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public EscrowStatus getStatus() { return status; }
    public void setStatus(EscrowStatus status) { this.status = status; }

    public Integer getRefundPercent() { return refundPercent; }
    public void setRefundPercent(Integer refundPercent) { this.refundPercent = refundPercent; }

    public Long getRefundedAmountMinor() { return refundedAmountMinor; }
    public void setRefundedAmountMinor(Long refundedAmountMinor) { this.refundedAmountMinor = refundedAmountMinor; }

    public OffsetDateTime getRefundedAt() { return refundedAt; }
    public void setRefundedAt(OffsetDateTime refundedAt) { this.refundedAt = refundedAt; }

    public OffsetDateTime getHoldUntil() { return holdUntil; }
    public void setHoldUntil(OffsetDateTime holdUntil) { this.holdUntil = holdUntil; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
}
