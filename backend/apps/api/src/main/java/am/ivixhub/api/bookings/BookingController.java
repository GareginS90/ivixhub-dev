package am.ivixhub.api.bookings;

import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.SessionType;
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

    public BookingController(BookingService bookingService, BookingCompletionService completionService) {
        this.bookingService = bookingService;
        this.completionService = completionService;
    }

    public record CreateBookingRequest(
            @NotNull Long psychologistId,
            @NotNull OffsetDateTime startAtUtc,
            @NotNull SessionType type
    ) {}

    public record BookingResponse(
            Long id,
            Long psychologistId,
            OffsetDateTime startAtUtc,
            OffsetDateTime endAtUtc,
            SessionType type,
            String status
    ) {}

    @PostMapping
    public BookingResponse create(Authentication auth, @RequestBody CreateBookingRequest req) {
        Long clientUserId = (Long) auth.getPrincipal();
        Booking b = bookingService.create(clientUserId, req.psychologistId(), req.startAtUtc(), req.type());
        return map(b);
    }

    @GetMapping("/my")
    public List<BookingResponse> my(Authentication auth) {
        Long clientUserId = (Long) auth.getPrincipal();
        return bookingService.myBookings(clientUserId).stream().map(this::map).toList();
    }

    @PostMapping("/{bookingId}/cancel")
    public BookingResponse cancel(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long clientUserId = (Long) auth.getPrincipal();
        return map(bookingService.cancelByClient(clientUserId, bookingId));
    }

    /**
     * Psychologist completes session (after endAtUtc).
     */
    @PostMapping("/{bookingId}/complete")
    public BookingCompletionService.CompleteBookingResponse complete(Authentication auth,
                                                                     @PathVariable("bookingId") Long bookingId) {
        Long psychologistUserId = (Long) auth.getPrincipal();
        return completionService.complete(psychologistUserId, bookingId);
    }

    private BookingResponse map(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getPsychologistId(),
                b.getStartAt(),
                b.getEndAt(),
                b.getSessionType(),
                b.getStatus().name()
        );
    }
}

