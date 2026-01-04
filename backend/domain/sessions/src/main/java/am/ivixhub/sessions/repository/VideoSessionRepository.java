package am.ivixhub.sessions.repository;

import am.ivixhub.sessions.domain.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VideoSessionRepository extends JpaRepository<VideoSession, Long> {
    Optional<VideoSession> findByBookingId(Long bookingId);
}
