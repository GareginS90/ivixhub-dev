package am.ivixhub.api.sessions;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.api.bookings.SessionTypeDurations;
import am.ivixhub.api.notifications.NotificationEventService;
import am.ivixhub.api.payments.PaymentService;
import am.ivixhub.api.video.providers.VideoProvider;
import am.ivixhub.api.video.providers.VideoProviderFactory;
import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.sessions.domain.SessionStatus;
import am.ivixhub.sessions.domain.VideoSession;
import am.ivixhub.sessions.repository.VideoSessionRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;

@Service
public class VideoSessionService {

    private static final long START_ALLOWED_BEFORE_MINUTES = 10;

    private final BookingRepository bookingRepository;
    private final VideoSessionRepository videoSessionRepository;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final VideoProviderFactory providerFactory;
    private final AuditService auditService;
    private final NotificationEventService notificationEvents;
    private final PaymentService paymentService;

    public VideoSessionService(BookingRepository bookingRepository,
                               VideoSessionRepository videoSessionRepository,
                               UserRepository userRepository,
                               PsychologistRepository psychologistRepository,
                               VideoProviderFactory providerFactory,
                               AuditService auditService,
                               NotificationEventService notificationEvents,
                               PaymentService paymentService) {
        this.bookingRepository = bookingRepository;
        this.videoSessionRepository = videoSessionRepository;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.providerFactory = providerFactory;
        this.auditService = auditService;
        this.notificationEvents = notificationEvents;
        this.paymentService = paymentService;
    }

    @Transactional
    public VideoJoinResponse join(Long userId, Long bookingId) {
        AccessContext access = resolveAccess(userId, bookingId);
        Booking booking = access.booking();

        assertVideoAllowedByBookingStatus(booking.getStatus());

        String channelName = "booking-" + bookingId;
        VideoProvider provider = providerFactory.current();

        VideoSession vs = getOrCreateSession(
                bookingId,
                booking.getPsychologistId(),
                booking.getClientUserId(),
                channelName,
                provider
        );

        OffsetDateTime expiresAtUtc = OffsetDateTime.now().plusMinutes(60);
        String role = access.isClient() ? "CLIENT" : "PSYCHOLOGIST";

        var token = provider.createJoinToken(new VideoProvider.CreateJoinTokenRequest(
                channelName,
                userId,
                role,
                expiresAtUtc
        ));

        auditService.log(
                userId,
                "VIDEO_JOIN_ISSUED",
                "Booking",
                bookingId,
                "provider=" + token.providerName()
                        + " channel=" + channelName
                        + " roomId=" + vs.getRoomId()
                        + " role=" + role,
                null,
                null
        );

        return map(booking, vs, token.token(), token.expiresAtUtc(), access);
    }

    @Transactional
    public VideoJoinResponse start(Long userId, Long bookingId) {
        AccessContext access = resolveAccess(userId, bookingId);

        if (!access.isPsychologist()) {
            throw new IllegalArgumentException("Only psychologist can start video session");
        }

        Booking booking = access.booking();
        assertVideoAllowedByBookingStatus(booking.getStatus());
        assertStartWindowAllowed(booking);

        VideoSession vs = videoSessionRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Video session not found"));

        if (vs.getStatus() == SessionStatus.NOT_STARTED) {
            vs.setStatus(SessionStatus.IN_PROGRESS);
            vs.setStartedAt(OffsetDateTime.now());
            vs = videoSessionRepository.save(vs);

            notificationEvents.videoSessionStartedForClient(booking.getClientUserId(), bookingId);
            if (access.psychologistUserId() != null) {
                notificationEvents.videoSessionStartedForPsychologist(access.psychologistUserId(), bookingId);
            }
        }

        return map(booking, vs, null, null, access);
    }

    @Transactional
    public VideoJoinResponse end(Long userId, Long bookingId) {
        AccessContext access = resolveAccess(userId, bookingId);
        Booking booking = access.booking();

        VideoSession vs = videoSessionRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Video session not found"));

        if (vs.getStatus() == SessionStatus.ENDED) {
            return map(booking, vs, null, null, access);
        }

        if (vs.getStatus() == SessionStatus.NOT_STARTED) {
            throw new IllegalArgumentException("Cannot end video session before it starts");
        }

        vs.setStatus(SessionStatus.ENDED);
        if (vs.getEndedAt() == null) {
            vs.setEndedAt(OffsetDateTime.now());
        }
        vs = videoSessionRepository.save(vs);

        notificationEvents.videoSessionEndedForClient(booking.getClientUserId(), bookingId);
        if (access.psychologistUserId() != null) {
            notificationEvents.videoSessionEndedForPsychologist(access.psychologistUserId(), bookingId);
        }

        completeBookingIfNeeded(booking, userId, access.isPsychologist());

        return map(booking, vs, null, null, access);
    }

    private VideoSession getOrCreateSession(Long bookingId,
                                            Long psychologistId,
                                            Long clientUserId,
                                            String channelName,
                                            VideoProvider provider) {
        return videoSessionRepository.findByBookingId(bookingId)
                .orElseGet(() -> {
                    var room = provider.createRoom(new VideoProvider.CreateRoomRequest(bookingId, channelName));

                    VideoSession s = new VideoSession();
                    s.setBookingId(bookingId);
                    s.setProvider(room.providerName());
                    s.setChannelName(room.channelName());
                    s.setRoomId(room.roomId());
                    s.setStatus(SessionStatus.NOT_STARTED);

                    VideoSession saved = videoSessionRepository.save(s);

                    notificationEvents.videoRoomReadyForClient(clientUserId, bookingId);

                    Long psychologistUserId = resolvePsychologistUserId(psychologistId);
                    if (psychologistUserId != null) {
                        notificationEvents.videoRoomReadyForPsychologist(psychologistUserId, bookingId);
                    }

                    return saved;
                });
    }

    private void assertVideoAllowedByBookingStatus(BookingStatus status) {
        if (status != BookingStatus.CONFIRMED && status != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Video session allowed only for CONFIRMED/COMPLETED bookings");
        }
    }

    private void assertStartWindowAllowed(Booking booking) {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime allowedFrom = booking.getStartAt().minusMinutes(START_ALLOWED_BEFORE_MINUTES);

        if (now.isBefore(allowedFrom)) {
            throw new IllegalArgumentException(
                    "Video session can be started only within " + START_ALLOWED_BEFORE_MINUTES + " minutes before booking start"
            );
        }

        if (now.isAfter(booking.getEndAt())) {
            throw new IllegalArgumentException("Cannot start video session after booking end time");
        }
    }

    private void completeBookingIfNeeded(Booking booking, Long actorUserId, boolean endedByPsychologist) {
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            return;
        }

        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        EscrowStatus escrowStatus = paymentService.releaseEscrowIfEligible(
                booking.getPsychologistId(),
                booking.getId()
        );

        notificationEvents.bookingCompleted(booking.getClientUserId(), booking.getId());

        auditService.log(
                actorUserId,
                "BOOKING_COMPLETED_FROM_VIDEO_SESSION",
                "Booking",
                booking.getId(),
                "endedBy=" + (endedByPsychologist ? "PSYCHOLOGIST" : "CLIENT")
                        + " escrowStatus=" + escrowStatus.name(),
                null,
                null
        );
    }

    private AccessContext resolveAccess(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        boolean isClient = booking.getClientUserId().equals(userId);
        Long psychologistUserId = resolvePsychologistUserId(booking.getPsychologistId());
        boolean isPsychologist = psychologistUserId != null && psychologistUserId.equals(userId);

        if (!isClient && !isPsychologist) {
            throw new IllegalArgumentException("No access to booking");
        }

        return new AccessContext(booking, isClient, isPsychologist, psychologistUserId);
    }

    private Long resolvePsychologistUserId(Long psychologistId) {
        return psychologistRepository.findById(psychologistId)
                .map(p -> p.getUser().getId())
                .orElse(null);
    }

    private VideoJoinResponse map(Booking booking,
                                  VideoSession vs,
                                  String joinToken,
                                  OffsetDateTime expiresAtUtc,
                                  AccessContext access) {
        Duration duration = SessionTypeDurations.resolve(booking.getSessionType());
        OffsetDateTime expectedStartAt = booking.getStartAt();
        OffsetDateTime expectedEndAt = expectedStartAt.plus(duration);

        OffsetDateTime allowedStartFrom = expectedStartAt.minusMinutes(START_ALLOWED_BEFORE_MINUTES);
        OffsetDateTime now = OffsetDateTime.now();

        String availabilityReason;
        boolean canEnterRoom;

        if (vs.getStatus() == SessionStatus.ENDED) {
            canEnterRoom = false;
            availabilityReason = "SESSION_ENDED";
        } else if (vs.getStatus() == SessionStatus.IN_PROGRESS) {
            canEnterRoom = true;
            availabilityReason = "READY";
        } else if (now.isBefore(allowedStartFrom)) {
            canEnterRoom = false;
            availabilityReason = "TOO_EARLY";
        } else {
            canEnterRoom = false;
            availabilityReason = access.isPsychologist() ? "CAN_START_SESSION" : "WAITING_FOR_PSYCHOLOGIST";
        }

        String roomUrl = "https://mock.video/" + vs.getChannelName();

        return new VideoJoinResponse(
                vs.getId(),
                vs.getBookingId(),
                vs.getProvider(),
                vs.getChannelName(),
                vs.getRoomId(),
                roomUrl,
                joinToken,
                expiresAtUtc,
                vs.getStatus().name(),
                vs.getStartedAt(),
                vs.getEndedAt(),
                booking.getStatus().name(),
                booking.getSessionType().name(),
                expectedStartAt,
                expectedEndAt,
                allowedStartFrom,
                canEnterRoom,
                availabilityReason
        );
    }

    private record AccessContext(
            Booking booking,
            boolean isClient,
            boolean isPsychologist,
            Long psychologistUserId
    ) {
    }

    public record VideoJoinResponse(
            Long sessionId,
            Long bookingId,
            String provider,
            String channelName,
            String roomId,
            String roomUrl,
            String joinToken,
            OffsetDateTime expiresAtUtc,
            String status,
            OffsetDateTime startedAt,
            OffsetDateTime endedAt,
            String bookingStatus,
            String sessionType,
            OffsetDateTime expectedStartAt,
            OffsetDateTime expectedEndAt,
            OffsetDateTime allowedStartFrom,
            boolean canEnterRoom,
            String availabilityReason
    ) {
    }
}
