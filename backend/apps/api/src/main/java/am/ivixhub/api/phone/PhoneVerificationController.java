package am.ivixhub.api.phone;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phone")
public class PhoneVerificationController {

    private final PhoneVerificationService service;

    public PhoneVerificationController(PhoneVerificationService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public void start(Authentication auth, @Valid @RequestBody StartPhoneVerificationRequest req) {
        Long userId = (Long) auth.getPrincipal();
        service.start(userId, req.phone());
    }

    @PostMapping("/verify")
    public void verify(Authentication auth,
                       @RequestParam("phone") String phone,
                       @Valid @RequestBody VerifyPhoneCodeRequest req) {
        Long userId = (Long) auth.getPrincipal();
        service.verify(userId, phone, req.code());
    }
}

