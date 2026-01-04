package am.ivixhub.api.chat;

import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.chat.domain.ChatMessage;
import am.ivixhub.chat.repository.ChatMessageRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class ChatService {

    private final BookingRepository bookingRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;

    public ChatService(BookingRepository bookingRepository,
                       ChatMessageRepository chatMessageRepository,
                       UserRepository userRepository,
                       PsychologistRepository psychologistRepository) {
        this.bookingRepository = bookingRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
    }

    @Transactional(readOnly = true)
    public ChatPageResponse list(Long userId, Long bookingId, Integer limit, Long beforeId) {
        ensureAccess(userId, bookingId);

        int lim = normalizeLimit(limit);

        List<ChatMessage> raw;
        if (beforeId == null) {
            raw = chatMessageRepository.findTop100ByBookingIdOrderByIdDesc(bookingId);
        } else {
            raw = chatMessageRepository.findTop100ByBookingIdAndIdLessThanOrderByIdDesc(bookingId, beforeId);
        }

        // raw: newest first, take limit, then reverse to chronological
        if (raw.size() > lim) {
            raw = raw.subList(0, lim);
        }
        Collections.reverse(raw);

        Long nextBeforeId = raw.isEmpty() ? beforeId : raw.get(0).getId(); // самый старый id в ответе

        var items = raw.stream()
                .map(m -> new ChatMessageResponse(
                        m.getId(),
                        m.getBookingId(),
                        m.getSenderUserId(),
                        m.getSenderRole(),
                        m.getMessageText(),
                        m.getCreatedAt()
                ))
                .toList();

        return new ChatPageResponse(items, nextBeforeId);
    }

    @Transactional
    public ChatMessageResponse send(Long userId, Long bookingId, String text) {
        var booking = ensureAccess(userId, bookingId);

        String role = booking.getClientUserId().equals(userId) ? "CLIENT" : "PSYCHOLOGIST";

        ChatMessage msg = new ChatMessage();
        msg.setBookingId(bookingId);
        msg.setSenderUserId(userId);
        msg.setSenderRole(role);
        msg.setMessageText(text);

        ChatMessage saved = chatMessageRepository.save(msg);

        return new ChatMessageResponse(
                saved.getId(),
                saved.getBookingId(),
                saved.getSenderUserId(),
                saved.getSenderRole(),
                saved.getMessageText(),
                saved.getCreatedAt()
        );
    }

    private int normalizeLimit(Integer limit) {
        int lim = (limit == null) ? 50 : limit;
        if (lim < 1) lim = 1;
        if (lim > 100) lim = 100;
        return lim;
    }

    private am.ivixhub.bookings.domain.Booking ensureAccess(Long userId, Long bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        boolean isClient = booking.getClientUserId().equals(userId);

        boolean isPsychologist = false;
        if (!isClient) {
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            var psych = psychologistRepository.findByUser(user)
                    .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));
            isPsychologist = booking.getPsychologistId().equals(psych.getId());
        }

        if (!isClient && !isPsychologist) {
            throw new IllegalArgumentException("No access to booking");
        }

        return booking;
    }

    public record ChatMessageResponse(
            Long id,
            Long bookingId,
            Long senderUserId,
            String senderRole,
            String text,
            java.time.OffsetDateTime createdAt
    ) {}

    public record ChatPageResponse(
            List<ChatMessageResponse> items,
            Long nextBeforeId
    ) {}
}

