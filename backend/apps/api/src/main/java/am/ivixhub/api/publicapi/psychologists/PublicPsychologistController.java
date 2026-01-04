package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.api.error.NotFoundException;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PublicPsychologistController {

    private final PsychologistRepository psychologistRepository;

    public PublicPsychologistController(PsychologistRepository psychologistRepository) {
        this.psychologistRepository = psychologistRepository;
    }

    /**
     * GET /api/public/psychologists?language=HY&method=cbt&specialization=anxiety
     * method + specialization are catalog codes (lowercase).
     */
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
                .map(p -> new PublicPsychologistResponse(
                        p.getId(),
                        p.getExperienceYears(),
                        p.getBio(),
                        p.getVerifiedAt()
                ))
                .toList();
    }

    @GetMapping("/api/public/psychologists/{id}")
    public PublicPsychologistProfileResponse getById(@PathVariable("id") Long id) {
        var p = psychologistRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Psychologist not found"));

        if (!p.isActive() || p.getStatus() != PsychologistStatus.VERIFIED) {
            throw new NotFoundException("Psychologist not found");
        }

        return new PublicPsychologistProfileResponse(
                p.getId(),
                p.getExperienceYears(),
                p.getBio(),
                p.getLanguages(),
                p.getMethods(),          // now Set<String> codes
                p.getSpecializations(),  // Set<String> codes
                p.getVerifiedAt()
        );
    }

    private String normalize(String s) {
        if (s == null) return null;
        String x = s.trim().toLowerCase();
        return x.isBlank() ? null : x;
    }
}
