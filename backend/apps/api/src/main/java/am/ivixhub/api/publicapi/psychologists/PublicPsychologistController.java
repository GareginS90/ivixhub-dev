package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.api.error.NotFoundException;
import am.ivixhub.api.reviews.ReviewService;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PublicPsychologistController {

    private final PsychologistRepository psychologistRepository;
    private final ReviewService reviewService;

    public PublicPsychologistController(PsychologistRepository psychologistRepository,
                                        ReviewService reviewService) {
        this.psychologistRepository = psychologistRepository;
        this.reviewService = reviewService;
    }

    @GetMapping("/api/public/psychologists")
    public List<PublicPsychologistResponse> listVerified(
            @RequestParam(value = "language", required = false) PsychologistLanguage language,
            @RequestParam(value = "method", required = false) String method,
            @RequestParam(value = "specialization", required = false) String specialization
    ) {
        String methodCode = normalize(method);
        String specCode = normalize(specialization);

        return psychologistRepository.searchVerified(PsychologistStatus.VERIFIED, language, methodCode, specCode)
                .stream()
                .map(p -> {
                    var reviews = reviewService.getPsychologistPublicReviews(p.getId());

                    return new PublicPsychologistResponse(
                            p.getId(),
                            p.getExperienceYears(),
                            p.getBio(),
                            p.getVerifiedAt(),
                            resolveDisplayName(p),
                            p.getLanguages(),
                            reviews.ratingAvg(),
                            reviews.reviewsCount()
                    );
                })
                .toList();
    }

    @GetMapping("/api/public/psychologists/{id}")
    public PublicPsychologistProfileResponse getById(@PathVariable("id") Long id) {
        var p = psychologistRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Psychologist not found"));

        if (!p.isActive() || p.getStatus() != PsychologistStatus.VERIFIED) {
            throw new NotFoundException("Psychologist not found");
        }

        var reviews = reviewService.getPsychologistPublicReviews(p.getId());

        return new PublicPsychologistProfileResponse(
                p.getId(),
                resolveDisplayName(p),
                p.getExperienceYears(),
                p.getBio(),
                p.getLanguages(),
                p.getMethods(),
                p.getSpecializations(),
                p.getVerifiedAt(),
                reviews.ratingAvg(),
                reviews.reviewsCount(),
                reviews.recentReviews().stream()
                        .map(x -> new PublicPsychologistReviewResponse(
                                x.id(),
                                x.rating(),
                                x.comment(),
                                x.authorDisplayName(),
                                x.createdAt()
                        ))
                        .toList()
        );
    }

    private String normalize(String s) {
        if (s == null) return null;
        String x = s.trim().toLowerCase();
        return x.isBlank() ? null : x;
    }

    private String resolveDisplayName(am.ivixhub.psychologists.domain.Psychologist p) {
        if (p.getUser() != null && p.getUser().getFullName() != null) {
            String fullName = p.getUser().getFullName().trim();
            if (!fullName.isBlank()) {
                return fullName;
            }
        }
        return "Psychologist";
    }
}
