package am.ivixhub.api.psychologists.onboarding;

import am.ivixhub.api.catalog.CatalogValidationService;
import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistDocumentType;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistDocumentRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class PsychologistOnboardingService {

    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final PsychologistDocumentRepository documentRepository;
    private final CatalogValidationService catalogValidationService;

    public PsychologistOnboardingService(UserRepository userRepository,
                                         PsychologistRepository psychologistRepository,
                                         PsychologistDocumentRepository documentRepository,
                                         CatalogValidationService catalogValidationService) {
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.documentRepository = documentRepository;
        this.catalogValidationService = catalogValidationService;
    }

    @Transactional
    public PsychologistOnboardingResponse start(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.isPhoneVerified()) {
            throw new IllegalArgumentException("Phone not verified");
        }

        var existing = psychologistRepository.findByUser(user);
        if (existing.isPresent()) {
            return PsychologistOnboardingResponse.from(existing.get());
        }

        try {
            Psychologist created = new Psychologist();
            created.setUser(user);
            created.setStatus(PsychologistStatus.DRAFT);
            created.setActive(true);

            Psychologist saved = psychologistRepository.save(created);
            return PsychologistOnboardingResponse.from(saved);
        } catch (DataIntegrityViolationException ex) {
            return psychologistRepository.findByUser(user)
                    .map(PsychologistOnboardingResponse::from)
                    .orElseThrow(() -> ex);
        }
    }

    @Transactional
    public PsychologistOnboardingResponse updateProfile(Long userId, PsychologistOnboardingProfileRequest req) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist p = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        if (p.getStatus() != PsychologistStatus.DRAFT) {
            throw new IllegalArgumentException("Profile is not editable in current status: " + p.getStatus());
        }

        var normalizedMethods = catalogValidationService.normalizeAndValidateMethods(req.methods());
        var normalizedSpecs = catalogValidationService.normalizeAndValidateSpecializations(req.specializations());

        p.setExperienceYears(req.experienceYears());
        p.setBio(req.bio());
        p.setLanguages(req.languages());
        p.setMethods(normalizedMethods);
        p.setSpecializations(normalizedSpecs);

        psychologistRepository.save(p);
        return PsychologistOnboardingResponse.from(p);
    }

    @Transactional
    public PsychologistOnboardingResponse submit(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.isPhoneVerified()) {
            throw new IllegalArgumentException("Phone not verified");
        }

        Psychologist p = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        if (p.getStatus() != PsychologistStatus.DRAFT) {
            throw new IllegalArgumentException("Not in DRAFT");
        }

        if (p.getExperienceYears() <= 0) {
            throw new IllegalArgumentException("experienceYears must be > 0");
        }

        boolean hasDiploma = documentRepository.existsByPsychologistIdAndDocType(p.getId(), PsychologistDocumentType.DIPLOMA);
        boolean hasId = documentRepository.existsByPsychologistIdAndDocType(p.getId(), PsychologistDocumentType.ID_CARD);
        boolean hasPhoto = documentRepository.existsByPsychologistIdAndDocType(p.getId(), PsychologistDocumentType.PROFILE_PHOTO);

        if (!hasDiploma || !hasId || !hasPhoto) {
            StringBuilder missing = new StringBuilder();
            if (!hasDiploma) missing.append("DIPLOMA");
            if (!hasId) {
                if (!missing.isEmpty()) missing.append(", ");
                missing.append("ID_CARD");
            }
            if (!hasPhoto) {
                if (!missing.isEmpty()) missing.append(", ");
                missing.append("PROFILE_PHOTO");
            }
            throw new IllegalArgumentException("Missing required documents: " + missing);
        }

        p.setStatus(PsychologistStatus.PENDING_VERIFICATION);
        p.setSubmittedAt(OffsetDateTime.now());
        psychologistRepository.save(p);

        return PsychologistOnboardingResponse.from(p);
    }
}
