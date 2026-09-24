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
import java.util.Set;

@Service
public class PsychologistOnboardingService {

    private static final Set<PsychologistStatus> EDITABLE_STATUSES = Set.of(
            PsychologistStatus.DRAFT,
            PsychologistStatus.VERIFIED,
            PsychologistStatus.REJECTED
    );

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
            return PsychologistOnboardingResponse.from(existing.get(), resolveAvatarUrl(existing.get().getId()));
        }

        try {
            Psychologist created = new Psychologist();
            created.setUser(user);
            created.setStatus(PsychologistStatus.DRAFT);
            created.setActive(true);

            Psychologist saved = psychologistRepository.save(created);
            return PsychologistOnboardingResponse.from(saved, resolveAvatarUrl(saved.getId()));
        } catch (DataIntegrityViolationException ex) {
            return psychologistRepository.findByUser(user)
                    .map(p -> PsychologistOnboardingResponse.from(p, resolveAvatarUrl(p.getId())))
                    .orElseThrow(() -> ex);
        }
    }

    @Transactional
    public PsychologistOnboardingResponse updateProfile(Long userId, PsychologistOnboardingProfileRequest req) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist p = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        if (!EDITABLE_STATUSES.contains(p.getStatus())) {
            throw new IllegalArgumentException("Profile is not editable in current status: " + p.getStatus());
        }

        var normalizedMethods = catalogValidationService.normalizeAndValidateMethods(req.methods());
        var normalizedSpecs = catalogValidationService.normalizeAndValidateSpecializations(req.specializations());

        p.setExperienceYears(req.experienceYears());
        p.setBio(req.bio() == null ? null : req.bio().trim());
        p.setLanguages(req.languages());
        p.setMethods(normalizedMethods);
        p.setSpecializations(normalizedSpecs);

        user.setGender(req.gender());
        userRepository.save(user);

        Psychologist saved = psychologistRepository.save(p);
        return PsychologistOnboardingResponse.from(saved, resolveAvatarUrl(saved.getId()));
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

        if (p.getStatus() != PsychologistStatus.DRAFT && p.getStatus() != PsychologistStatus.REJECTED) {
            throw new IllegalArgumentException("Submit is allowed only from DRAFT or REJECTED");
        }

        if (p.getExperienceYears() <= 0) {
            throw new IllegalArgumentException("experienceYears must be > 0");
        }

        if (p.getBio() == null || p.getBio().trim().length() < 20) {
            throw new IllegalArgumentException("bio must contain at least 20 characters");
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
        Psychologist saved = psychologistRepository.save(p);

        return PsychologistOnboardingResponse.from(saved, resolveAvatarUrl(saved.getId()));
    }

    private String resolveAvatarUrl(Long psychologistId) {
        return documentRepository.findAllByPsychologistId(psychologistId)
                .stream()
                .filter(doc -> doc.getDocType() == PsychologistDocumentType.PROFILE_PHOTO)
                .sorted((a, b) -> b.getUploadedAt().compareTo(a.getUploadedAt()))
                .map(doc -> doc.getFileUrl() == null ? null : doc.getFileUrl().trim())
                .filter(url -> url != null && !url.isBlank())
                .findFirst()
                .orElse(null);
    }
}
