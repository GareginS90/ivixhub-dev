package am.ivixhub.api.sessions;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.api.video.providers.VideoProvider;
import am.ivixhub.api.video.providers.VideoProviderFactory;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.sessions.domain.SessionStatus;
import am.ivixhub.sessions.domain.VideoSession;
import am.ivixhub.sessions.repository.VideoSessionRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class VideoSessionService {

    private final BookingRepository bookingRepository;
    private final VideoSessionRepository videoSessionRepository;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final VideoProviderFactory providerFactory;
    private final AuditService auditService;

    public VideoSessionService(BookingRepository bookingRepository,
                               VideoSessionRepository videoSessionRepository,
                               UserRepository userRepository,
                               PsychologistRepository psychologistRepository,
                               VideoProviderFactory providerFactory,
                               AuditService auditService) {
        this.bookingRepository = bookingRepository;
        this.videoSessionRepository = videoSessionRepository;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.providerFactory = providerFactory;
        this.auditService = auditService;
    }

    @Transactional
    public VideoJoinResponse join(Long userId, Long bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        boolean isClient = booking.getClientUserId().equals(userId);

        boolean isPsychologist = false;
        if (!isClient) {
            var userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                var psychOpt = psychologistRepository.findByUser(userOpt.get());
                if (psychOpt.isPresent()) {
                    isPsychologist = booking.getPsychologistId().equals(psychOpt.get().getId());
                }
            }
        }

        if (!isClient && !isPsychologist) {
            throw new IllegalArgumentException("No access to booking");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED && booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Video session allowed only for CONFIRMED/COMPLETED bookings");
        }

        String channelName = "booking-" + bookingId;

        VideoProvider provider = providerFactory.current();

        VideoSession vs = videoSessionRepository.findByBookingId(bookingId)
                .orElseGet(() -> {
                    var room = provider.createRoom(new VideoProvider.CreateRoomRequest(bookingId, channelName));
                    VideoSession s = new VideoSession();
                    s.setBookingId(bookingId);
                    s.setProvider(room.providerName());
                    s.setChannelName(room.channelName());
                    s.setRoomId(room.roomId());
                    s.setStatus(SessionStatus.NOT_STARTED);
                    return videoSessionRepository.save(s);
                });

        OffsetDateTime expiresAtUtc = OffsetDateTime.now().plusMinutes(60);
        String role = isClient ? "CLIENT" : "PSYCHOLOGIST";

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
                "provider=" + token.providerName() + " channel=" + channelName + " roomId=" + vs.getRoomId() + " role=" + role,
                null,
                null
        );

        String roomUrl = "https://mock.video/" + channelName;

        return new VideoJoinResponse(
                vs.getId(),
                vs.getBookingId(),
                vs.getProvider(),
                vs.getChannelName(),
                vs.getRoomId(),
                roomUrl,
                token.token(),
                token.expiresAtUtc(),
                vs.getStatus().name(),
                vs.getStartedAt(),
                vs.getEndedAt()
        );
    }

    @Transactional
    public VideoJoinResponse start(Long userId, Long bookingId) {
        VideoSession vs = videoSessionRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Video session not found"));

        if (vs.getStatus() == SessionStatus.NOT_STARTED) {
            vs.setStatus(SessionStatus.IN_PROGRESS);
            vs.setStartedAt(OffsetDateTime.now());
            videoSessionRepository.save(vs);
        }

        return join(userId, bookingId);
    }

    @Transactional
    public VideoJoinResponse end(Long userId, Long bookingId) {
        VideoSession vs = videoSessionRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Video session not found"));

        if (vs.getStatus() != SessionStatus.ENDED) {
            vs.setStatus(SessionStatus.ENDED);
            vs.setEndedAt(OffsetDateTime.now());
            videoSessionRepository.save(vs);
        }

        return join(userId, bookingId);
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
            OffsetDateTime endedAt
    ) {}
}

