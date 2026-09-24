package am.ivixhub.notifications.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "notifications",
        indexes = {
                @Index(name = "idx_notif_user_id", columnList = "user_id"),
                @Index(name = "idx_notif_created_at", columnList = "created_at"),
                @Index(name = "idx_notif_related_booking_id", columnList = "related_booking_id")
        })
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "body", nullable = false, length = 2000)
    private String body;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "related_booking_id")
    private Long relatedBookingId;

    @Column(name = "read", nullable = false)
    private boolean read = false;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getRelatedBookingId() { return relatedBookingId; }
    public void setRelatedBookingId(Long relatedBookingId) { this.relatedBookingId = relatedBookingId; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
}
