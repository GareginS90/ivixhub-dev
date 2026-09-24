package am.ivixhub.api.notifications;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public NotificationListResponse myNotifications(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return notificationService.getMyNotifications(userId);
    }

    @PostMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(Authentication auth,
                                           @PathVariable("notificationId") Long notificationId) {
        Long userId = (Long) auth.getPrincipal();
        return notificationService.markAsRead(userId, notificationId);
    }

    @PostMapping("/read-all")
    public NotificationListResponse markAllAsRead(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return notificationService.markAllAsRead(userId);
    }
}
