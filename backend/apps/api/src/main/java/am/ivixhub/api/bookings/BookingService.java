package am.ivixhub.api.bookings;

import am.ivixhub.api.escrow.EscrowOrchestratorService;
import am.ivixhub.api.notifications.NotificationEventService;
import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.domain.SessionLanguage;
import am.ivixhub.bookings.domain.SessionType;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.repository.PsychologistAvailabilityRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class BookingService {

    private static final List<BookingStatus> CANCELLED_STATUSES =
            List.of(
                    BookingStatus.CANCELLED_BY_CLIENT,
                    BookingStatus.CANCELLED_BY_PSYCHOLOGIST,
                    BookingStatus.EXPIRED_PAYMENT
            );

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final PsychologistAvailabilityRepository availabilityRepository;
    private final NotificationEventService notificationEvents;
    private final EscrowOrchestratorService escrowOrchestratorService;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          PsychologistRepository psychologistRepository,
                          PsychologistAvailabilityRepository availabilityRepository,
                          NotificationEventService notificationEvents,
                          EscrowOrchestratorService escrowOrchestratorService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.availabilityRepository = availabilityRepository;
        this.notificationEvents = notificationEvents;
        this.escrowOrchestratorService = escrowOrchestratorService;
    }

    @Transactional
    public Booking create(Long clientUserId, Long psychologistId, OffsetDateTime startAtUtc, SessionType type, SessionLanguage language) {
        userRepository.findById(clientUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        if (startAtUtc == null) {
            throw new IllegalArgumentException("startAtUtc is required");
        }
        if (type == null) {
            throw new IllegalArgumentException("type is required");
        }
        if (language == null) {
            throw new IllegalArgumentException("language is required");
        }

        OffsetDateTime endAtUtc = switch (type) {
            case SELF -> startAtUtc.plusMinutes(50);
            case COUPLES -> startAtUtc.plusMinutes(90);
            case GROUP -> startAtUtc.plusHours(3);
        };

        boolean ok = availabilityRepository.isSlotAvailable(psychologistId, startAtUtc, endAtUtc);
        if (!ok) {
            throw new IllegalArgumentException("Slot is outside availability");
        }

        boolean overlaps = bookingRepository.existsOverlapExcluding(psychologistId, startAtUtc, endAtUtc, CANCELLED_STATUSES);
        if (overlaps) {
            throw new IllegalArgumentException("Slot is already booked");
        }

        Booking b = new Booking();
        b.setClientUserId(clientUserId);
        b.setPsychologistId(psychologistId);
        b.setSessionType(type);
        b.setSessionLanguage(language);
        b.setStartAt(startAtUtc);
        b.setEndAt(endAtUtc);
        b.setStatus(BookingStatus.CREATED);

        Booking saved = bookingRepository.save(b);

        notificationEvents.bookingCreated(clientUserId, saved.getId());

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Booking> myBookings(Long clientUserId) {
        return bookingRepository.findAllByClientUserIdOrderByStartAtDesc(clientUserId);
    }

    @Transactional(readOnly = true)
    public List<Booking> myPsychologistBookings(Long psychologistUserId) {
        User user = userRepository.findById(psychologistUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        return bookingRepository.findAllByPsychologistIdOrderByStartAtDesc(psychologist.getId());
    }

    @Transactional
    public Booking cancelByClient(Long clientUserId, Long bookingId) {
        Booking b = bookingRepository.findByIdAndClientUserId(bookingId, clientUserId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (b.getStatus() == BookingStatus.CANCELLED_BY_CLIENT) {
            return b;
        }

        if (b.getStatus() != BookingStatus.CREATED && b.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("This booking cannot be cancelled in its current status");
        }

        long hoursUntilStart = java.time.Duration.between(OffsetDateTime.now(), b.getStartAt()).toHours();
        int refundPercent = hoursUntilStart >= 24 ? 100 : 40;

        b.setStatus(BookingStatus.CANCELLED_BY_CLIENT);
        Booking saved = bookingRepository.save(b);

        notificationEvents.bookingCancelled(clientUserId, saved.getId());

        try {
            var refundResult = escrowOrchestratorService.refundForClientCancellation(
                    saved.getId(),
                    clientUserId,
                    refundPercent
            );

            notificationEvents.refundProcessed(
                    clientUserId,
                    saved.getId(),
                    refundResult.refundPercent(),
                    refundResult.refundedAmountMinor(),
                    refundResult.currency()
            );
        } catch (IllegalArgumentException ignored) {
        }

        return saved;
    }

    @Transactional
    public Booking cancelByPsychologist(Long psychologistUserId, Long bookingId) {
        User user = userRepository.findById(psychologistUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        Booking b = bookingRepository.findByIdAndPsychologistId(bookingId, psychologist.getId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (b.getStatus() == BookingStatus.CANCELLED_BY_PSYCHOLOGIST) {
            return b;
        }

        if (b.getStatus() != BookingStatus.CREATED && b.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("This booking cannot be cancelled in its current status");
        }

        b.setStatus(BookingStatus.CANCELLED_BY_PSYCHOLOGIST);
        Booking saved = bookingRepository.save(b);

        notificationEvents.bookingCancelled(saved.getClientUserId(), saved.getId());

        try {
            var refundResult = escrowOrchestratorService.refundForClientCancellation(
                    saved.getId(),
                    saved.getClientUserId(),
                    100
            );

            notificationEvents.refundProcessed(
                    saved.getClientUserId(),
                    saved.getId(),
                    refundResult.refundPercent(),
                    refundResult.refundedAmountMinor(),
                    refundResult.currency()
            );
        } catch (IllegalArgumentException ignored) {
        }

        return saved;
    }
}
