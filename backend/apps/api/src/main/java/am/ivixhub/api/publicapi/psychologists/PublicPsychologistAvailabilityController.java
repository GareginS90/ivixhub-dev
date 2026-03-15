package am.ivixhub.api.publicapi.psychologists;

import am.ivixhub.api.error.NotFoundException;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.domain.WeekDay;
import am.ivixhub.psychologists.repository.PsychologistAvailabilityRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PublicPsychologistAvailabilityController {

    private final PsychologistRepository psychologistRepository;
    private final PsychologistAvailabilityRepository availabilityRepository;

    public record PublicAvailabilityResponse(
            Long id,
            Long psychologistId,
            WeekDay dayOfWeek,
            String startTimeUtc,
            String endTimeUtc
    ) {}

    public PublicPsychologistAvailabilityController(PsychologistRepository psychologistRepository,
                                                   PsychologistAvailabilityRepository availabilityRepository) {
        this.psychologistRepository = psychologistRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @GetMapping("/api/public/psychologists/{id}/availability")
    public List<PublicAvailabilityResponse> list(@PathVariable("id") Long psychologistId) {
        var p = psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new NotFoundException("Psychologist not found"));

        if (!p.isActive() || p.getStatus() != PsychologistStatus.VERIFIED) {
            throw new NotFoundException("Psychologist not found");
        }

        return availabilityRepository.findAllByPsychologistIdAndActiveTrue(psychologistId)
                .stream()
                .map(a -> new PublicAvailabilityResponse(
                        a.getId(),
                        a.getPsychologistId(),
                        a.getDayOfWeek(),
                        a.getStartTimeUtc().toString(),
                        a.getEndTimeUtc().toString()
                ))
                .toList();
    }
}
