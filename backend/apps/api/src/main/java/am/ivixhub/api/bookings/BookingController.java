package am.ivixhub.api.bookings;

import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.SessionLanguage;
import am.ivixhub.bookings.domain.SessionType;
import am.ivixhub.users.repository.UserRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BookingCompletionService completionService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService,
                             BookingCompletionService completionService,
                             UserRepository userRepository) {
        this.bookingService = bookingService;
        this.completionService = completionService;
        this.userRepository = userRepository;
    }

    public record CreateBookingRequest(
            @NotNull Long psychologistId,
            @NotNull OffsetDateTime startAtUtc,
            @NotNull SessionType type,
            @NotNull SessionLanguage language
    ) {}

    @PostMapping
    public BookingResponse create(Authentication auth, @RequestBody CreateBookingRequest req) {
        Long clientUserId = (Long) auth.getPrincipal();
        Booking b = bookingService.create(
                clientUserId,
                req.psychologistId(),
                req.startAtUtc(),
                req.type(),
                req.language()
        );
        return map(b);
    }

    @GetMapping("/my")
    public List<BookingResponse> my(Authentication auth) {
        Long clientUserId = (Long) auth.getPrincipal();
        return bookingService.myBookings(clientUserId).stream().map(this::map).toList();
    }

    @GetMapping("/psychologist/my")
    public List<BookingResponse> psychologistMy(Authentication auth) {
        Long psychologistUserId = (Long) auth.getPrincipal();
        return bookingService.myPsychologistBookings(psychologistUserId).stream().map(this::map).toList();
    }

    @PostMapping("/{bookingId}/cancel")
    public BookingResponse cancel(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long clientUserId = (Long) auth.getPrincipal();
        return map(bookingService.cancelByClient(clientUserId, bookingId));
    }

    @PostMapping("/{bookingId}/psychologist-cancel")
    public BookingResponse psychologistCancel(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long psychologistUserId = (Long) auth.getPrincipal();
        return map(bookingService.cancelByPsychologist(psychologistUserId, bookingId));
    }

    @PostMapping("/{bookingId}/complete")
    public BookingCompletionService.CompleteBookingResponse complete(Authentication auth,
                                                                     @PathVariable("bookingId") Long bookingId) {
        Long psychologistUserId = (Long) auth.getPrincipal();
        return completionService.complete(psychologistUserId, bookingId);
    }

    private BookingResponse map(Booking b) {
        var client = userRepository.findById(b.getClientUserId()).orElse(null);

        String clientDisplayName = null;
        String clientUsername = null;
        java.time.LocalDate clientBirthDate = null;
        am.ivixhub.users.domain.UserGender clientGender = am.ivixhub.users.domain.UserGender.UNSPECIFIED;

        if (client != null) {
            clientDisplayName = client.getFullName();
            clientUsername = client.getUsername();
            clientBirthDate = client.getBirthDate();
            if (client.getGender() != null) {
                clientGender = client.getGender();
            }
        }

        return new BookingResponse(
                b.getId(),
                b.getClientUserId(),
                b.getPsychologistId(),
                clientDisplayName,
                clientUsername,
                clientBirthDate,
                clientGender,
                b.getStartAt(),
                b.getEndAt(),
                b.getSessionType(),
                b.getSessionLanguage(),
                b.getStatus()
        );
    }
}
