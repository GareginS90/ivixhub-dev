package am.ivixhub.api.bookings;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.api.notifications.NotificationService;
import am.ivixhub.api.payments.PaymentService;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class BookingCompletionService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public BookingCompletionService(BookingRepository bookingRepository,
                                    UserRepository userRepository,
                                    PsychologistRepository psychologistRepository,
                                    PaymentService paymentService,
                                    NotificationService notificationService,
                                    AuditService auditService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public CompleteBookingResponse complete(Long psychologistUserId, Long bookingId) {
        var user = userRepository.findById(psychologistUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getPsychologistId().equals(psychologist.getId())) {
            throw new IllegalArgumentException("Not your booking");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Booking must be CONFIRMED to complete");
        }

        if (booking.getEndAt().isAfter(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Session not ended yet");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        EscrowStatus escrowStatus = paymentService.releaseEscrowIfEligible(psychologist.getId(), bookingId);

        notificationService.notifyInApp(
                booking.getClientUserId(),
                "BOOKING_COMPLETED",
                "Session completed",
                "Your session for booking #" + bookingId + " is completed."
        );

        auditService.log(
                psychologistUserId,
                "BOOKING_COMPLETED",
                "Booking",
                bookingId,
                "escrowStatus=" + escrowStatus.name(),
                null,
                null
        );

        return new CompleteBookingResponse(
                booking.getId(),
                booking.getStatus().name(),
                escrowStatus.name()
        );
    }

    public record CompleteBookingResponse(Long bookingId, String bookingStatus, String escrowStatus) {}
}

