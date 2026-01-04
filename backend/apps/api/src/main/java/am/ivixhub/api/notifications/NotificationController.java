package am.ivixhub.api.notifications;

import am.ivixhub.notifications.domain.Notification;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/my")
    public List<Notification> my(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return service.my(userId);
    }

    @PostMapping("/{id}/read")
    public void markRead(Authentication auth, @PathVariable("id") Long id) {
        Long userId = (Long) auth.getPrincipal();
        service.markRead(userId, id);
    }
}
