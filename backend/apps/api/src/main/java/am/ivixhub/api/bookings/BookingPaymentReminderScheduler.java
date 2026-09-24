package am.ivixhub.api.bookings;

import am.ivixhub.api.notifications.NotificationEventService;
import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Component
public class BookingPaymentReminderScheduler {

    private static final List<BookingStatus> PENDING_PAYMENT_STATUSES =
            List.of(BookingStatus.CREATED);

    private final BookingRepository bookingRepository;
    private final NotificationEventService notificationEvents;

    public BookingPaymentReminderScheduler(BookingRepository bookingRepository,
                                           NotificationEventService notificationEvents) {
        this.bookingRepository = bookingRepository;
        this.notificationEvents = notificationEvents;
    }

    @Scheduled(fixedDelay = 300000)
    @Transactional
    public void processPendingPaymentBookings() {
        OffsetDateTime now = OffsetDateTime.now();

        send15MinuteReminders(now.minusMinutes(15));
        send1HourReminders(now.minusHours(1));
        expireOldPendingBookings(now.minusHours(2));
    }

    private void send15MinuteReminders(OffsetDateTime threshold) {
        List<Booking> candidates = bookingRepository
                .findAllByStatusInAndCreatedAtLessThan(PENDING_PAYMENT_STATUSES, threshold);

        for (Booking booking : candidates) {
            notificationEvents.paymentReminder15m(booking.getClientUserId(), booking.getId());
        }
    }

    private void send1HourReminders(OffsetDateTime threshold) {
        List<Booking> candidates = bookingRepository
                .findAllByStatusInAndCreatedAtLessThan(PENDING_PAYMENT_STATUSES, threshold);

        for (Booking booking : candidates) {
            notificationEvents.paymentReminder1h(booking.getClientUserId(), booking.getId());
        }
    }

    private void expireOldPendingBookings(OffsetDateTime threshold) {
        List<Booking> candidates = bookingRepository
                .findAllByStatusInAndCreatedAtLessThan(PENDING_PAYMENT_STATUSES, threshold);

        for (Booking booking : candidates) {
            if (booking.getStatus() != BookingStatus.CREATED) {
                continue;
            }

            booking.setStatus(BookingStatus.EXPIRED_PAYMENT);
            bookingRepository.save(booking);

            notificationEvents.paymentExpired(booking.getClientUserId(), booking.getId());
        }
    }
}
