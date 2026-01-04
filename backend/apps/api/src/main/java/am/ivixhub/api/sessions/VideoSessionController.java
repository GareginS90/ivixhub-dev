package am.ivixhub.api.sessions;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class VideoSessionController {

    private final VideoSessionService service;

    public VideoSessionController(VideoSessionService service) {
        this.service = service;
    }

    private Long requireUserId(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return (Long) auth.getPrincipal();
    }

    // ✅ New endpoints
    @PostMapping("/api/sessions/{bookingId}/video/join")
    public VideoSessionService.VideoJoinResponse join(Authentication auth,
                                                      @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);
        return service.join(userId, bookingId);
    }

    @PostMapping("/api/sessions/{bookingId}/video/start")
    public VideoSessionService.VideoJoinResponse start(Authentication auth,
                                                       @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);
        return service.start(userId, bookingId);
    }

    @PostMapping("/api/sessions/{bookingId}/video/end")
    public VideoSessionService.VideoJoinResponse end(Authentication auth,
                                                     @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);
        return service.end(userId, bookingId);
    }

    // ✅ Legacy endpoints
    @GetMapping("/api/video/{bookingId}")
    public VideoSessionService.VideoJoinResponse getLegacy(Authentication auth,
                                                           @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);
        return service.join(userId, bookingId);
    }

    @PostMapping("/api/video/{bookingId}/start")
    public VideoSessionService.VideoJoinResponse startLegacy(Authentication auth,
                                                             @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);
        return service.start(userId, bookingId);
    }

    @PostMapping("/api/video/{bookingId}/end")
    public VideoSessionService.VideoJoinResponse endLegacy(Authentication auth,
                                                           @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);
        return service.end(userId, bookingId);
    }
}

