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

@RestController
@RequestMapping("/api/psychologists/availability")
public class PsychologistAvailabilityController {

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

        if (psychologist.getStatus() != PsychologistStatus.VERIFIED) {
            throw new IllegalArgumentException("Psychologist must be VERIFIED to set availability");
        }

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

        return new AvailabilityResponse(
                saved.getId(),
                saved.getPsychologistId(),
                saved.getDayOfWeek(),
                saved.getStartTimeUtc().toString(),
                saved.getEndTimeUtc().toString()
        );
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
                .map(x -> new AvailabilityResponse(
                        x.getId(),
                        x.getPsychologistId(),
                        x.getDayOfWeek(),
                        x.getStartTimeUtc().toString(),
                        x.getEndTimeUtc().toString()
                ))
                .toList();
    }
}
