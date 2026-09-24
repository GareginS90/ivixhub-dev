package am.ivixhub.notifications.repository;

import am.ivixhub.notifications.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findTop50ByUserIdOrderByIdDesc(Long userId);

    long countByUserIdAndReadFalse(Long userId);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndTypeAndBody(Long userId, String type, String body);
}
