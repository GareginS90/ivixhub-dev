package am.ivixhub.api.notifications;

import am.ivixhub.notifications.domain.Notification;

import java.time.OffsetDateTime;

public record NotificationResponse(
        Long id,
        String type,
        String title,
        String message,
        Long relatedBookingId,
        boolean read,
        OffsetDateTime createdAt
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getBody(),
                notification.getRelatedBookingId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
