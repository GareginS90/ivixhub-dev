package am.ivixhub.api.notifications;

import am.ivixhub.notifications.domain.Notification;
import am.ivixhub.notifications.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void notifyInApp(Long userId, String type, String title, String body) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setBody(body);
        n.setRead(false);
        notificationRepository.save(n);
    }

    // MOCK email
    public void sendEmailMock(String toEmail, String subject, String body) {
        log.info("[EMAIL MOCK] to={} subject={} body={}", toEmail, subject, body);
    }

    // MOCK sms
    public void sendSmsMock(String phone, String message) {
        log.info("[SMS MOCK] to={} message={}", phone, message);
    }

    @Transactional(readOnly = true)
    public List<Notification> my(Long userId) {
        return notificationRepository.findTop50ByUserIdOrderByIdDesc(userId);
    }

    @Transactional
    public void markRead(Long userId, Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!n.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not your notification");
        }

        n.setRead(true);
        notificationRepository.save(n);
    }
}
