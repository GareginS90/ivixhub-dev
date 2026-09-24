package am.ivixhub.api.notifications;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.notifications.domain.Notification;
import am.ivixhub.notifications.repository.NotificationRepository;
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
        createIfMissing(
                clientUserId,
                "BOOKING_CREATED",
                "Booking created",
                "Your booking #" + bookingId + " was created.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_BOOKING_CREATED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void bookingConfirmed(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "BOOKING_CONFIRMED",
                "Booking confirmed",
                "Your booking #" + bookingId + " is confirmed.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_BOOKING_CONFIRMED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void bookingCancelled(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "BOOKING_CANCELLED",
                "Booking cancelled",
                "Your booking #" + bookingId + " was cancelled.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_BOOKING_CANCELLED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void bookingCompleted(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "BOOKING_COMPLETED",
                "Session completed",
                "Your session for booking #" + bookingId + " is completed.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_BOOKING_COMPLETED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void paymentReminder15m(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "PAYMENT_REMINDER_15M",
                "Complete your payment",
                "Your booking #" + bookingId + " is still waiting for payment.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_PAYMENT_REMINDER_15M", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void paymentReminder1h(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "PAYMENT_REMINDER_1H",
                "Payment reminder",
                "Your booking #" + bookingId + " still has no completed payment.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_PAYMENT_REMINDER_1H", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void paymentExpired(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "PAYMENT_EXPIRED",
                "Payment window expired",
                "Your payment window for booking #" + bookingId + " has expired. Please create a new booking if you still want this session.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_PAYMENT_EXPIRED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void refundProcessed(Long clientUserId, Long bookingId, int refundPercent, long refundedAmountMinor, String currency) {
        createIfMissing(
                clientUserId,
                "BOOKING_REFUND_PROCESSED",
                "Refund processed",
                "Your cancellation for booking #" + bookingId + " was accepted. Refund: " + refundPercent + "% (" + refundedAmountMinor + " " + currency + ").",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_BOOKING_REFUND_PROCESSED", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void sessionReminder24h(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "SESSION_REMINDER_24H",
                "Session reminder",
                "Your session for booking #" + bookingId + " starts in 24 hours.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_SESSION_REMINDER_24H", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void sessionReminder1h(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "SESSION_REMINDER_1H",
                "Session reminder",
                "Your session for booking #" + bookingId + " starts in 1 hour.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_SESSION_REMINDER_1H", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void sessionReminder10m(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "SESSION_REMINDER_10M",
                "Session starting soon",
                "Your session for booking #" + bookingId + " starts in 10 minutes.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_SESSION_REMINDER_10M", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void psychologistSessionReminder24h(Long psychologistUserId, Long bookingId) {
        createIfMissing(
                psychologistUserId,
                "PSYCHOLOGIST_SESSION_REMINDER_24H",
                "Upcoming session reminder",
                "A confirmed session for booking #" + bookingId + " starts in 24 hours.",
                bookingId
        );
        auditService.log(psychologistUserId, "NOTIF_PSYCHOLOGIST_SESSION_REMINDER_24H", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void psychologistSessionReminder1h(Long psychologistUserId, Long bookingId) {
        createIfMissing(
                psychologistUserId,
                "PSYCHOLOGIST_SESSION_REMINDER_1H",
                "Upcoming session reminder",
                "A confirmed session for booking #" + bookingId + " starts in 1 hour.",
                bookingId
        );
        auditService.log(psychologistUserId, "NOTIF_PSYCHOLOGIST_SESSION_REMINDER_1H", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void psychologistSessionReminder10m(Long psychologistUserId, Long bookingId) {
        createIfMissing(
                psychologistUserId,
                "PSYCHOLOGIST_SESSION_REMINDER_10M",
                "Session starting soon",
                "A confirmed session for booking #" + bookingId + " starts in 10 minutes.",
                bookingId
        );
        auditService.log(psychologistUserId, "NOTIF_PSYCHOLOGIST_SESSION_REMINDER_10M", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void videoRoomReadyForClient(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "VIDEO_ROOM_READY_CLIENT",
                "Video room is ready",
                "Your video room for booking #" + bookingId + " is ready.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_VIDEO_ROOM_READY_CLIENT", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void videoRoomReadyForPsychologist(Long psychologistUserId, Long bookingId) {
        createIfMissing(
                psychologistUserId,
                "VIDEO_ROOM_READY_PSYCHOLOGIST",
                "Video room is ready",
                "The video room for booking #" + bookingId + " is ready.",
                bookingId
        );
        auditService.log(psychologistUserId, "NOTIF_VIDEO_ROOM_READY_PSYCHOLOGIST", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void videoSessionStartedForClient(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "VIDEO_SESSION_STARTED_CLIENT",
                "Video session started",
                "Your video session for booking #" + bookingId + " has started.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_VIDEO_SESSION_STARTED_CLIENT", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void videoSessionStartedForPsychologist(Long psychologistUserId, Long bookingId) {
        createIfMissing(
                psychologistUserId,
                "VIDEO_SESSION_STARTED_PSYCHOLOGIST",
                "Video session started",
                "The video session for booking #" + bookingId + " has started.",
                bookingId
        );
        auditService.log(psychologistUserId, "NOTIF_VIDEO_SESSION_STARTED_PSYCHOLOGIST", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void videoSessionEndedForClient(Long clientUserId, Long bookingId) {
        createIfMissing(
                clientUserId,
                "VIDEO_SESSION_ENDED_CLIENT",
                "Video session ended",
                "Your video session for booking #" + bookingId + " has ended.",
                bookingId
        );
        auditService.log(clientUserId, "NOTIF_VIDEO_SESSION_ENDED_CLIENT", "Booking", bookingId, "in-app", null, null);
    }

    @Transactional
    public void videoSessionEndedForPsychologist(Long psychologistUserId, Long bookingId) {
        createIfMissing(
                psychologistUserId,
                "VIDEO_SESSION_ENDED_PSYCHOLOGIST",
                "Video session ended",
                "The video session for booking #" + bookingId + " has ended.",
                bookingId
        );
        auditService.log(psychologistUserId, "NOTIF_VIDEO_SESSION_ENDED_PSYCHOLOGIST", "Booking", bookingId, "in-app", null, null);
    }

    private void createIfMissing(Long userId,
                                 String type,
                                 String title,
                                 String body,
                                 Long relatedBookingId) {
        boolean exists = repo.existsByUserIdAndTypeAndBody(userId, type, body);
        if (exists) {
            return;
        }

        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setBody(body);
        n.setRelatedBookingId(relatedBookingId);
        n.setRead(false);
        repo.save(n);
    }
}
