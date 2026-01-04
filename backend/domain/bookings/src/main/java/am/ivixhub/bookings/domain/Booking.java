package am.ivixhub.bookings.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "bookings",
        indexes = {
                @Index(name = "idx_booking_client_user_id", columnList = "client_user_id"),
                @Index(name = "idx_booking_psychologist_id", columnList = "psychologist_id"),
                @Index(name = "idx_booking_start_at", columnList = "start_at")
        })
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // кто бронирует (User.id)
    @Column(name = "client_user_id", nullable = false)
    private Long clientUserId;

    // к кому бронируют (Psychologist.id)
    @Column(name = "psychologist_id", nullable = false)
    private Long psychologistId;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", nullable = false, length = 20)
    private SessionType sessionType;

    // ВРЕМЯ В UTC
    @Column(name = "start_at", nullable = false)
    private OffsetDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private OffsetDateTime endAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BookingStatus status = BookingStatus.CREATED;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // ===== getters/setters =====

    public Long getId() { return id; }

    public Long getClientUserId() { return clientUserId; }
    public void setClientUserId(Long clientUserId) { this.clientUserId = clientUserId; }

    public Long getPsychologistId() { return psychologistId; }
    public void setPsychologistId(Long psychologistId) { this.psychologistId = psychologistId; }

    public SessionType getSessionType() { return sessionType; }
    public void setSessionType(SessionType sessionType) { this.sessionType = sessionType; }

    public OffsetDateTime getStartAt() { return startAt; }
    public void setStartAt(OffsetDateTime startAt) { this.startAt = startAt; }

    public OffsetDateTime getEndAt() { return endAt; }
    public void setEndAt(OffsetDateTime endAt) { this.endAt = endAt; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
