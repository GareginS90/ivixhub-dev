package am.ivixhub.chat.repository;

import am.ivixhub.chat.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Последние N сообщений (сначала новые)
    List<ChatMessage> findTop100ByBookingIdOrderByIdDesc(Long bookingId);

    // Сообщения старше beforeId (сначала новые)
    List<ChatMessage> findTop100ByBookingIdAndIdLessThanOrderByIdDesc(Long bookingId, Long beforeId);
}

