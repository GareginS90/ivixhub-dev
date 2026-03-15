package am.ivixhub.api.accountdeletion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountDeletionRequestRepository extends JpaRepository<AccountDeletionRequest, Long> {

    Optional<AccountDeletionRequest> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndStatus(Long userId, AccountDeletionRequestStatus status);
}
