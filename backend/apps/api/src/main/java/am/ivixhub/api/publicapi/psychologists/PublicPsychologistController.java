package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.api.error.NotFoundException;
import am.ivixhub.api.reviews.ReviewService;
import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistDocumentType;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistDocumentRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.domain.UserGender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
public class PublicPsychologistController {

    private final PsychologistRepository psychologistRepository;
    private final PsychologistDocumentRepository documentRepository;
    private final ReviewService reviewService;
    private final Path storageRoot;

    public PublicPsychologistController(
            PsychologistRepository psychologistRepository,
            PsychologistDocumentRepository documentRepository,
            ReviewService reviewService,
            @Value("${ivixhub.storage.local.rootDir}") String storageRoot
    ) {
        this.psychologistRepository = psychologistRepository;
        this.documentRepository = documentRepository;
        this.reviewService = reviewService;
        this.storageRoot = Paths.get(storageRoot).toAbsolutePath().normalize();
    }

    @GetMapping("/api/public/psychologists")
    public List<PublicPsychologistResponse> listVerified(
            @RequestParam(value = "language", required = false) PsychologistLanguage language,
            @RequestParam(value = "gender", required = false) UserGender gender,
            @RequestParam(value = "method", required = false) String method,
            @RequestParam(value = "specialization", required = false) String specialization,
            @RequestParam(value = "ageFrom", required = false) Integer ageFrom,
            @RequestParam(value = "ageTo", required = false) Integer ageTo
    ) {
        String methodCode = normalize(method);
        String specCode = normalize(specialization);

        Integer normalizedAgeFrom = normalizeAge(ageFrom);
        Integer normalizedAgeTo = normalizeAge(ageTo);

        if (normalizedAgeFrom != null
                && normalizedAgeTo != null
                && normalizedAgeFrom > normalizedAgeTo) {
            throw new IllegalArgumentException(
                    "ageFrom must be less than or equal to ageTo"
            );
        }

        LocalDate birthDateFrom = resolveBirthDateFrom(normalizedAgeTo);
        LocalDate birthDateTo = resolveBirthDateTo(normalizedAgeFrom);

        return psychologistRepository.searchVerified(
                        PsychologistStatus.VERIFIED,
                        language,
                        gender,
                        methodCode,
                        specCode,
                        birthDateFrom,
                        birthDateTo
                )
                .stream()
                .map(p -> {
                    var reviews =
                            reviewService.getPsychologistPublicReviews(p.getId());

                    return new PublicPsychologistResponse(
                            p.getId(),
                            p.getExperienceYears(),
                            p.getBio(),
                            p.getVerifiedAt(),
                            resolveDisplayName(p),
                            p.getLanguages(),
                            resolveAge(p),
                            resolveGender(p),
                            resolveAvatarUrl(p),
                            reviews.ratingAvg(),
                            reviews.reviewsCount()
                    );
                })
                .toList();
    }

    @GetMapping("/api/public/psychologists/{id}")
    public PublicPsychologistProfileResponse getById(
            @PathVariable("id") Long id
    ) {
        Psychologist p = psychologistRepository.findById(id)
                .orElseThrow(
                        () -> new NotFoundException("Psychologist not found")
                );

        if (!p.isActive()
                || p.getStatus() != PsychologistStatus.VERIFIED) {
            throw new NotFoundException("Psychologist not found");
        }

        var reviews =
                reviewService.getPsychologistPublicReviews(p.getId());

        return new PublicPsychologistProfileResponse(
                p.getId(),
                resolveDisplayName(p),
                p.getExperienceYears(),
                p.getBio(),
                p.getLanguages(),
                p.getMethods(),
                p.getSpecializations(),
                resolveAge(p),
                resolveGender(p),
                resolveAvatarUrl(p),
                p.getVerifiedAt(),
                reviews.ratingAvg(),
                reviews.reviewsCount(),
                reviews.recentReviews()
                        .stream()
                        .map(x -> new PublicPsychologistReviewResponse(
                                x.id(),
                                x.rating(),
                                x.comment(),
                                x.authorDisplayName(),
                                x.createdAt(),
                                x.replyComment(),
                                x.repliedAt()
                        ))
                        .toList()
        );
    }

    @GetMapping("/api/public/psychologists/{id}/avatar")
    public ResponseEntity<Resource> getAvatar(
            @PathVariable("id") Long id
    ) {
        Psychologist psychologist = psychologistRepository.findById(id)
                .orElseThrow(
                        () -> new NotFoundException("Psychologist not found")
                );

        if (!psychologist.isActive()
                || psychologist.getStatus() != PsychologistStatus.VERIFIED) {
            throw new NotFoundException("Psychologist not found");
        }

        var document = documentRepository
                .findTopByPsychologistIdAndDocTypeOrderByUploadedAtDesc(
                        id,
                        PsychologistDocumentType.PROFILE_PHOTO
                )
                .orElseThrow(
                        () -> new NotFoundException("Avatar not found")
                );

        String fileUrl = document.getFileUrl();

        if (fileUrl == null || fileUrl.isBlank()) {
            throw new NotFoundException("Avatar not found");
        }

        try {
            Path file = resolveStoredFile(fileUrl);

            if (!Files.exists(file)
                    || !Files.isRegularFile(file)
                    || !Files.isReadable(file)) {
                throw new NotFoundException("Avatar not found");
            }

            Resource resource = new UrlResource(file.toUri());

            String detectedContentType = Files.probeContentType(file);
            MediaType mediaType = resolveImageMediaType(
                    detectedContentType,
                    file
            );

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .cacheControl(
                            CacheControl
                                    .maxAge(1, TimeUnit.HOURS)
                                    .cachePublic()
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    sanitizeHeaderFilename(
                                            file.getFileName().toString()
                                    ) +
                                    "\""
                    )
                    .body(resource);

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new NotFoundException("Avatar not found");
        }
    }

    private Path resolveStoredFile(String fileUrl) {
        try {
            Path file;

            if (fileUrl.startsWith("file:")) {
                file = Paths.get(URI.create(fileUrl))
                        .toAbsolutePath()
                        .normalize();
            } else {
                file = Paths.get(fileUrl)
                        .toAbsolutePath()
                        .normalize();
            }

            if (!file.startsWith(storageRoot)) {
                throw new NotFoundException("Avatar not found");
            }

            return file;
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new NotFoundException("Avatar not found");
        }
    }

    private MediaType resolveImageMediaType(
            String detectedContentType,
            Path file
    ) {
        if (detectedContentType != null
                && detectedContentType.startsWith("image/")) {
            try {
                return MediaType.parseMediaType(detectedContentType);
            } catch (Exception ignored) {
                // Fall through to extension-based detection.
            }
        }

        String name = file.getFileName()
                .toString()
                .toLowerCase();

        if (name.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }

        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        }

        if (name.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        }

        if (name.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }

        throw new NotFoundException("Avatar not found");
    }

    private String sanitizeHeaderFilename(String filename) {
        return filename.replaceAll("[\\r\\n\"\\\\]", "_");
    }

    private String normalize(String s) {
        if (s == null) {
            return null;
        }

        String x = s.trim().toLowerCase();
        return x.isBlank() ? null : x;
    }

    private Integer normalizeAge(Integer age) {
        if (age == null) {
            return null;
        }

        if (age < 18) {
            return 18;
        }

        if (age > 100) {
            return 100;
        }

        return age;
    }

    private LocalDate resolveBirthDateFrom(Integer ageTo) {
        if (ageTo == null) {
            return null;
        }

        return LocalDate.now()
                .minusYears(ageTo.longValue() + 1L)
                .plusDays(1);
    }

    private LocalDate resolveBirthDateTo(Integer ageFrom) {
        if (ageFrom == null) {
            return null;
        }

        return LocalDate.now().minusYears(ageFrom.longValue());
    }

    private String resolveDisplayName(Psychologist p) {
        if (p.getUser() != null
                && p.getUser().getFullName() != null) {
            String fullName = p.getUser().getFullName().trim();

            if (!fullName.isBlank()) {
                return fullName;
            }
        }

        if (p.getUser() != null
                && p.getUser().getUsername() != null) {
            String username = p.getUser().getUsername().trim();

            if (!username.isBlank()) {
                return username;
            }
        }

        return "Psychologist";
    }

    private Integer resolveAge(Psychologist p) {
        if (p.getUser() == null
                || p.getUser().getBirthDate() == null) {
            return null;
        }

        LocalDate birthDate = p.getUser().getBirthDate();
        LocalDate today = LocalDate.now();

        if (birthDate.isAfter(today)) {
            return null;
        }

        return Period.between(birthDate, today).getYears();
    }

    private UserGender resolveGender(Psychologist p) {
        if (p.getUser() == null
                || p.getUser().getGender() == null) {
            return UserGender.UNSPECIFIED;
        }

        return p.getUser().getGender();
    }

    private String resolveAvatarUrl(Psychologist p) {
        boolean hasProfilePhoto = documentRepository
                .findTopByPsychologistIdAndDocTypeOrderByUploadedAtDesc(
                        p.getId(),
                        PsychologistDocumentType.PROFILE_PHOTO
                )
                .map(doc ->
                        doc.getFileUrl() != null
                                && !doc.getFileUrl().trim().isBlank()
                )
                .orElse(false);

        return hasProfilePhoto
                ? "/api/public/psychologists/" + p.getId() + "/avatar"
                : null;
    }
}
