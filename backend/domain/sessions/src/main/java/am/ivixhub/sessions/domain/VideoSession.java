package am.ivixhub.sessions.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "video_sessions",
        indexes = {
                @Index(name="idx_vs_booking_id", columnList = "booking_id"),
                @Index(name="idx_vs_room_id", columnList = "room_id"),
                @Index(name="idx_vs_channel_name", columnList = "channel_name")
        })
public class VideoSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="booking_id", nullable = false, unique = true)
    private Long bookingId;

    @Column(name="provider", nullable = false, length = 40)
    private String provider = "MOCK_VIDEO";

    @Column(name="channel_name", length = 128)
    private String channelName;

    @Column(name="room_id", nullable = false, length = 100)
    private String roomId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus status = SessionStatus.NOT_STARTED;

    @Column(name="created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name="started_at")
    private OffsetDateTime startedAt;

    @Column(name="ended_at")
    private OffsetDateTime endedAt;

    public Long getId() { return id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getChannelName() { return channelName; }
    public void setChannelName(String channelName) { this.channelName = channelName; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(OffsetDateTime endedAt) { this.endedAt = endedAt; }
}

