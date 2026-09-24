package am.ivixhub.api.auth;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/auth/recovery")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    public PasswordRecoveryController(PasswordRecoveryService passwordRecoveryService) {
        this.passwordRecoveryService = passwordRecoveryService;
    }

    @PostMapping("/request")
    public Map<String, Object> request(@Valid @RequestBody PasswordRecoveryRequest request) {
        passwordRecoveryService.requestCode(request.phone(), request.role());
        return Map.of("ok", true);
    }

    @PostMapping("/verify")
    public PasswordRecoveryVerifyResponse verify(@Valid @RequestBody PasswordRecoveryVerifyRequest request) {
        return passwordRecoveryService.verifyCode(request.phone(), request.code());
    }

    @PostMapping("/reset")
    public Map<String, Object> reset(@Valid @RequestBody PasswordRecoveryResetRequest request) {
        passwordRecoveryService.resetPassword(
                request.phone(),
                request.recoveryToken(),
                request.password()
        );
        return Map.of("ok", true);
    }
}
