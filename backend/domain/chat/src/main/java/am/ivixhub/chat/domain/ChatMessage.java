package am.ivixhub.chat.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "chat_messages",
        indexes = {
                @Index(name = "idx_cm_booking_id", columnList = "booking_id"),
                @Index(name = "idx_cm_created_at", columnList = "created_at")
        })
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="booking_id", nullable = false)
    private Long bookingId;

    @Column(name="sender_user_id", nullable = false)
    private Long senderUserId;

    @Column(name="sender_role", nullable = false, length = 20)
    private String senderRole; // CLIENT / PSYCHOLOGIST

    @Column(name="message_text", nullable = false, length = 4000)
    private String messageText;

    @Column(name="created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getSenderUserId() { return senderUserId; }
    public void setSenderUserId(Long senderUserId) { this.senderUserId = senderUserId; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
}
