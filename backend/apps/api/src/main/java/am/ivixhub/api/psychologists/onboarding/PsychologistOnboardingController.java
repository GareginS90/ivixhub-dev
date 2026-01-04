package am.ivixhub.api.psychologists.onboarding;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/psychologists/onboarding")
public class PsychologistOnboardingController {

    private final PsychologistOnboardingService service;

    public PsychologistOnboardingController(PsychologistOnboardingService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public PsychologistOnboardingResponse start(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return service.start(userId);
    }

    @PutMapping("/profile")
    public PsychologistOnboardingResponse updateProfile(Authentication auth,
                                                        @Valid @RequestBody PsychologistOnboardingProfileRequest req) {
        Long userId = (Long) auth.getPrincipal();
        return service.updateProfile(userId, req);
    }

    @PostMapping("/submit")
    public PsychologistOnboardingResponse submit(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return service.submit(userId);
    }
}

