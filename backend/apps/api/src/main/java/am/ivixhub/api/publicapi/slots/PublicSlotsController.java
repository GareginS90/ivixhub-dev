package am.ivixhub.api.publicapi.slots;

import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.domain.SessionType;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.domain.WeekDay;
import am.ivixhub.psychologists.repository.PsychologistAvailabilityRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PublicSlotsController {

    private final PsychologistRepository psychologistRepository;
    private final PsychologistAvailabilityRepository availabilityRepository;
    private final BookingRepository bookingRepository;

    public PublicSlotsController(PsychologistRepository psychologistRepository,
                                 PsychologistAvailabilityRepository availabilityRepository,
                                 BookingRepository bookingRepository) {
        this.psychologistRepository = psychologistRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/api/public/psychologists/{id}/slots")
    public List<SlotResponse> slots(@PathVariable("id") Long psychologistId,
                                    @RequestParam("from") OffsetDateTime fromUtc,
                                    @RequestParam("to") OffsetDateTime toUtc,
                                    @RequestParam("type") SessionType type) {

        var p = psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        if (!p.isActive() || p.getStatus() != PsychologistStatus.VERIFIED) {
            throw new IllegalArgumentException("Psychologist not available");
        }

        int durationMin = switch (type) {
            case SELF -> 50;
            case COUPLES -> 90;
            case GROUP -> 180;
        };

        var availability = availabilityRepository.findAllByPsychologistIdAndActiveTrue(psychologistId);

        var conflicts = bookingRepository.findConflicts(
                psychologistId,
                fromUtc,
                toUtc,
                List.of(
                        BookingStatus.CANCELLED_BY_CLIENT,
                        BookingStatus.CANCELLED_BY_PSYCHOLOGIST,
                        BookingStatus.EXPIRED_PAYMENT
                )
        );

        List<SlotResponse> result = new ArrayList<>();

        LocalDate startDate = fromUtc.toLocalDate();
        LocalDate endDate = toUtc.toLocalDate();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            WeekDay wd = mapDay(date.getDayOfWeek());

            for (var a : availability) {
                if (a.getDayOfWeek() != wd) {
                    continue;
                }

                LocalTime t = a.getStartTimeUtc();

                while (t.plusMinutes(durationMin).isBefore(a.getEndTimeUtc()) || t.plusMinutes(durationMin).equals(a.getEndTimeUtc())) {
                    OffsetDateTime slotStart = OffsetDateTime.of(date, t, ZoneOffset.UTC);
                    OffsetDateTime slotEnd = slotStart.plusMinutes(durationMin);

                    if (slotStart.isBefore(fromUtc) || slotEnd.isAfter(toUtc)) {
                        t = t.plusMinutes(durationMin);
                        continue;
                    }

                    boolean overlaps = conflicts.stream().anyMatch(b ->
                            b.getStartAt().isBefore(slotEnd) && b.getEndAt().isAfter(slotStart)
                    );

                    result.add(new SlotResponse(slotStart, slotEnd, !overlaps));
                    t = t.plusMinutes(durationMin);
                }
            }
        }

        return result;
    }

    private WeekDay mapDay(DayOfWeek d) {
        return switch (d) {
            case MONDAY -> WeekDay.MON;
            case TUESDAY -> WeekDay.TUE;
            case WEDNESDAY -> WeekDay.WED;
            case THURSDAY -> WeekDay.THU;
            case FRIDAY -> WeekDay.FRI;
            case SATURDAY -> WeekDay.SAT;
            case SUNDAY -> WeekDay.SUN;
        };
    }

    public record SlotResponse(
            OffsetDateTime startAtUtc,
            OffsetDateTime endAtUtc,
            boolean available
    ) {
    }
}
