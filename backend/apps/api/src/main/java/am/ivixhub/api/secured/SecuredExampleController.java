package am.ivixhub.api.secured;

import am.ivixhub.api.guards.UserGuard;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecuredExampleController {

    private final UserGuard userGuard;

    public SecuredExampleController(UserGuard userGuard) {
        this.userGuard = userGuard;
    }

    @GetMapping("/api/secured/example")
    public String example(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        userGuard.requirePhoneVerified(userId);
        return "OK: phone verified access granted";
    }
}

