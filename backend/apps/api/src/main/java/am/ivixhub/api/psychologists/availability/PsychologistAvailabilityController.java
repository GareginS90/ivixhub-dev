package am.ivixhub.api.psychologists.availability;

import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistAvailability;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistAvailabilityRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/psychologists/availability")
public class PsychologistAvailabilityController {

    private static final Set<PsychologistStatus> EDITABLE_STATUSES = Set.of(
            PsychologistStatus.DRAFT,
            PsychologistStatus.PENDING_VERIFICATION,
            PsychologistStatus.VERIFIED,
            PsychologistStatus.REJECTED
    );

    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final PsychologistAvailabilityRepository availabilityRepository;

    public PsychologistAvailabilityController(UserRepository userRepository,
                                              PsychologistRepository psychologistRepository,
                                              PsychologistAvailabilityRepository availabilityRepository) {
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @PostMapping
    public AvailabilityResponse add(Authentication auth, @Valid @RequestBody AvailabilitySlotRequest req) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        assertAvailabilityEditable(psychologist);

        LocalTime start = LocalTime.parse(req.startTimeUtc());
        LocalTime end = LocalTime.parse(req.endTimeUtc());

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("Invalid time range");
        }

        PsychologistAvailability a = new PsychologistAvailability();
        a.setPsychologistId(psychologist.getId());
        a.setDayOfWeek(req.dayOfWeek());
        a.setStartTimeUtc(start);
        a.setEndTimeUtc(end);
        a.setActive(true);

        PsychologistAvailability saved = availabilityRepository.save(a);

        return map(saved);
    }

    @GetMapping
    public List<AvailabilityResponse> my(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        return availabilityRepository.findAllByPsychologistIdAndActiveTrue(psychologist.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    @DeleteMapping("/{availabilityId}")
    public void delete(Authentication auth, @PathVariable("availabilityId") Long availabilityId) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        assertAvailabilityEditable(psychologist);

        PsychologistAvailability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new IllegalArgumentException("Availability slot not found"));

        if (!availability.getPsychologistId().equals(psychologist.getId())) {
            throw new IllegalArgumentException("Not your availability slot");
        }

        availability.setActive(false);
        availabilityRepository.save(availability);
    }

    private void assertAvailabilityEditable(Psychologist psychologist) {
        if (!EDITABLE_STATUSES.contains(psychologist.getStatus())) {
            throw new IllegalArgumentException(
                    "Availability is not editable in current status: " + psychologist.getStatus()
            );
        }
    }

    private AvailabilityResponse map(PsychologistAvailability x) {
        return new AvailabilityResponse(
                x.getId(),
                x.getPsychologistId(),
                x.getDayOfWeek(),
                x.getStartTimeUtc().toString(),
                x.getEndTimeUtc().toString()
        );
    }
}
