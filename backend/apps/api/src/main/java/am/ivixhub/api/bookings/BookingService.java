package am.ivixhub.api.bookings;

import am.ivixhub.api.notifications.NotificationEventService;
import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.domain.SessionType;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.psychologists.repository.PsychologistAvailabilityRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class BookingService {

    private static final List<BookingStatus> CANCELLED_STATUSES =
            List.of(BookingStatus.CANCELLED_BY_CLIENT, BookingStatus.CANCELLED_BY_PSYCHOLOGIST);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final PsychologistAvailabilityRepository availabilityRepository;
    private final NotificationEventService notificationEvents;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          PsychologistRepository psychologistRepository,
                          PsychologistAvailabilityRepository availabilityRepository,
                          NotificationEventService notificationEvents) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.availabilityRepository = availabilityRepository;
        this.notificationEvents = notificationEvents;
    }

    @Transactional
    public Booking create(Long clientUserId, Long psychologistId, OffsetDateTime startAtUtc, SessionType type) {
        userRepository.findById(clientUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        if (startAtUtc == null) throw new IllegalArgumentException("startAtUtc is required");
        if (type == null) throw new IllegalArgumentException("type is required");

        OffsetDateTime endAtUtc = switch (type) {
            case SELF -> startAtUtc.plusMinutes(50);
            case COUPLES -> startAtUtc.plusMinutes(60);
            case GROUP -> startAtUtc.plusMinutes(90);
        };

        boolean ok = availabilityRepository.isSlotAvailable(psychologistId, startAtUtc, endAtUtc);
        if (!ok) throw new IllegalArgumentException("Slot is outside availability");

        boolean overlaps = bookingRepository.existsOverlapExcluding(psychologistId, startAtUtc, endAtUtc, CANCELLED_STATUSES);
        if (overlaps) throw new IllegalArgumentException("Slot is already booked");

        Booking b = new Booking();
        b.setClientUserId(clientUserId);
        b.setPsychologistId(psychologistId);
        b.setSessionType(type);
        b.setStartAt(startAtUtc);
        b.setEndAt(endAtUtc);
        b.setStatus(BookingStatus.CREATED);

        Booking saved = bookingRepository.save(b);

        // ✅ notify client: booking created
        notificationEvents.bookingCreated(clientUserId, saved.getId());

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Booking> myBookings(Long clientUserId) {
        return bookingRepository.findAllByClientUserIdOrderByStartAtDesc(clientUserId);
    }

    @Transactional
    public Booking cancelByClient(Long clientUserId, Long bookingId) {
        Booking b = bookingRepository.findByIdAndClientUserId(bookingId, clientUserId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (b.getStatus() == BookingStatus.CANCELLED_BY_CLIENT) {
            return b;
        }

        OffsetDateTime now = OffsetDateTime.now();
        if (Duration.between(now, b.getStartAt()).toHours() < 24) {
            throw new IllegalArgumentException("Cancellation not allowed менее чем за 24 часа");
        }

        b.setStatus(BookingStatus.CANCELLED_BY_CLIENT);
        Booking saved = bookingRepository.save(b);

        // ✅ notify client: booking cancelled
        notificationEvents.bookingCancelled(clientUserId, saved.getId());

        return saved;
    }
}
