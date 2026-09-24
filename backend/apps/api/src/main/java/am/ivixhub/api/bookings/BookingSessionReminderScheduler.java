package am.ivixhub.api.bookings;

import am.ivixhub.api.notifications.NotificationEventService;
import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

@Component
public class BookingSessionReminderScheduler {

    private static final List<BookingStatus> REMINDABLE_STATUSES =
            List.of(BookingStatus.CONFIRMED);

    private final BookingRepository bookingRepository;
    private final PsychologistRepository psychologistRepository;
    private final NotificationEventService notificationEvents;

    public BookingSessionReminderScheduler(BookingRepository bookingRepository,
                                           PsychologistRepository psychologistRepository,
                                           NotificationEventService notificationEvents) {
        this.bookingRepository = bookingRepository;
        this.psychologistRepository = psychologistRepository;
        this.notificationEvents = notificationEvents;
    }

    @Scheduled(fixedDelay = 300000)
    @Transactional
    public void processSessionReminders() {
        OffsetDateTime now = OffsetDateTime.now();

        List<Booking> candidates = bookingRepository.findAllByStatusInAndStartAtLessThanEqual(
                REMINDABLE_STATUSES,
                now.plusHours(24).plusMinutes(5)
        );

        for (Booking booking : candidates) {
            Duration untilStart = Duration.between(now, booking.getStartAt());

            if (untilStart.isNegative()) {
                continue;
            }

            Long psychologistUserId = psychologistRepository.findById(booking.getPsychologistId())
                    .map(psychologist -> psychologist.getUser().getId())
                    .orElse(null);

            long minutes = untilStart.toMinutes();

            if (minutes <= 10) {
                notificationEvents.sessionReminder10m(booking.getClientUserId(), booking.getId());

                if (psychologistUserId != null) {
                    notificationEvents.psychologistSessionReminder10m(psychologistUserId, booking.getId());
                }
                continue;
            }

            if (minutes <= 60) {
                notificationEvents.sessionReminder1h(booking.getClientUserId(), booking.getId());

                if (psychologistUserId != null) {
                    notificationEvents.psychologistSessionReminder1h(psychologistUserId, booking.getId());
                }
                continue;
            }

            if (minutes <= 24 * 60) {
                notificationEvents.sessionReminder24h(booking.getClientUserId(), booking.getId());

                if (psychologistUserId != null) {
                    notificationEvents.psychologistSessionReminder24h(psychologistUserId, booking.getId());
                }
            }
        }
    }
}
