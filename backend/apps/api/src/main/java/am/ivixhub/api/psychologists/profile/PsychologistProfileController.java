package am.ivixhub.api.psychologists.profile;

import am.ivixhub.api.catalog.CatalogValidationService;
import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;

@RestController
@RequestMapping("/api/psychologists/profile")
public class PsychologistProfileController {

    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final CatalogValidationService catalogValidationService;

    public PsychologistProfileController(UserRepository userRepository,
                                         PsychologistRepository psychologistRepository,
                                         CatalogValidationService catalogValidationService) {
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.catalogValidationService = catalogValidationService;
    }

    @PutMapping
    public void update(Authentication auth, @Valid @RequestBody PsychologistProfileUpdateRequest req) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist p = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        if (p.getStatus() != PsychologistStatus.VERIFIED) {
            throw new IllegalArgumentException("Profile can be edited only after VERIFIED");
        }

        var normalizedMethods = catalogValidationService.normalizeAndValidateMethods(req.methods());
        var normalizedSpecs = catalogValidationService.normalizeAndValidateSpecializations(req.specializations());

        p.setBio(req.bio());
        p.setLanguages(new HashSet<>(req.languages()));
        p.setMethods(normalizedMethods);
        p.setSpecializations(normalizedSpecs);

        psychologistRepository.save(p);
    }
}
