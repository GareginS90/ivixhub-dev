package am.ivixhub.api.notifications;

import am.ivixhub.notifications.domain.Notification;
import am.ivixhub.notifications.repository.NotificationRepository;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void notifyInApp(Long userId, String type, String title, String body) {
        notifyInApp(userId, type, title, body, null);
    }

    @Transactional
    public void notifyInApp(Long userId, String type, String title, String body, Long relatedBookingId) {
        ensureUserExists(userId);

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type == null || type.isBlank() ? "GENERAL" : type.trim().toUpperCase());
        notification.setTitle(title);
        notification.setBody(body);
        notification.setRelatedBookingId(relatedBookingId);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    @Transactional
    public void createInAppNotification(Long recipientUserId,
                                        NotificationType type,
                                        String title,
                                        String message,
                                        Long relatedBookingId,
                                        OffsetDateTime scheduledAt) {
        notifyInApp(
                recipientUserId,
                type == null ? "GENERAL" : type.name(),
                title,
                message,
                relatedBookingId
        );
    }

    @Transactional(readOnly = true)
    public NotificationListResponse getMyNotifications(Long userId) {
        List<NotificationResponse> items = notificationRepository
                .findTop50ByUserIdOrderByIdDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .toList();

        long unreadCount = notificationRepository.countByUserIdAndReadFalse(userId);

        return new NotificationListResponse(unreadCount, items);
    }

    @Transactional
    public NotificationResponse markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }

        return NotificationResponse.from(notification);
    }

    @Transactional
    public NotificationListResponse markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findTop50ByUserIdOrderByIdDesc(userId);

        boolean changed = false;
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                changed = true;
            }
        }

        if (changed) {
            notificationRepository.saveAll(notifications);
        }

        List<NotificationResponse> items = notifications.stream()
                .map(NotificationResponse::from)
                .toList();

        return new NotificationListResponse(0, items);
    }

    private void ensureUserExists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("User is inactive");
        }
    }
}
