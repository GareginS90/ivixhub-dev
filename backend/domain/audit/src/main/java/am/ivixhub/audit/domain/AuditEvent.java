package am.ivixhub.audit.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "audit_events",
        indexes = {
                @Index(name="idx_audit_actor_user_id", columnList = "actor_user_id"),
                @Index(name="idx_audit_created_at", columnList = "created_at"),
                @Index(name="idx_audit_action", columnList = "action")
        })
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="actor_user_id")
    private Long actorUserId; // может быть null (system)

    @Column(name="action", nullable = false, length = 100)
    private String action; // e.g. PSYCHOLOGIST_APPROVE

    @Column(name="target_type", length = 100)
    private String targetType; // e.g. Psychologist, Booking

    @Column(name="target_id")
    private Long targetId;

    @Column(name="details", length = 4000)
    private String details;

    @Column(name="ip", length = 64)
    private String ip;

    @Column(name="user_agent", length = 300)
    private String userAgent;

    @Column(name="created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }

    public Long getActorUserId() { return actorUserId; }
    public void setActorUserId(Long actorUserId) { this.actorUserId = actorUserId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
}
