package am.ivixhub.api.debug;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Profile("dev")
@RestController
public class DebugAuthController {

    @GetMapping("/api/debug/auth")
    public Object auth(Authentication auth) {
        if (auth == null) {
            return "AUTH IS NULL";
        }
        return new DebugAuthResponse(
                auth.getPrincipal(),
                auth.getAuthorities().stream().map(a -> a.getAuthority()).toList(),
                auth.isAuthenticated()
        );
    }

    public record DebugAuthResponse(Object principal, List<String> authorities, boolean authenticated) {}
}

