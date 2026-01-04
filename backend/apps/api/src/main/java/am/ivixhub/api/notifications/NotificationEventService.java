package am.ivixhub.api.notifications;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.notifications.repository.NotificationRepository;
import am.ivixhub.notifications.domain.Notification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationEventService {

    private final NotificationRepository repo;
    private final AuditService auditService;

    public NotificationEventService(NotificationRepository repo, AuditService auditService) {
        this.repo = repo;
        this.auditService = auditService;
    }

    @Transactional
    public void bookingCreated(Long clientUserId, Long bookingId) {
        create(clientUserId,
                "BOOKING_CREATED",
                "Booking created",
                "Your booking #" + bookingId + " was created.");
        auditService.log(clientUserId, "NOTIF_BOOKING_CREATED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void bookingConfirmed(Long clientUserId, Long bookingId) {
        create(clientUserId,
                "BOOKING_CONFIRMED",
                "Booking confirmed",
                "Your booking #" + bookingId + " is confirmed.");
        auditService.log(clientUserId, "NOTIF_BOOKING_CONFIRMED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void bookingCancelled(Long clientUserId, Long bookingId) {
        create(clientUserId,
                "BOOKING_CANCELLED",
                "Booking cancelled",
                "Your booking #" + bookingId + " was cancelled.");
        auditService.log(clientUserId, "NOTIF_BOOKING_CANCELLED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void bookingCompleted(Long clientUserId, Long bookingId) {
        create(clientUserId,
                "BOOKING_COMPLETED",
                "Session completed",
                "Your session for booking #" + bookingId + " is completed.");
        auditService.log(clientUserId, "NOTIF_BOOKING_COMPLETED", "Booking", bookingId, "in-app", null, null);
    }

    private void create(Long userId, String type, String title, String body) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setBody(body);
        n.setRead(false);
        repo.save(n);
    }
}
