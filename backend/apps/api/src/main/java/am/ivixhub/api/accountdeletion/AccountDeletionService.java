package am.ivixhub.api.accountdeletion;

import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountDeletionService {

    private final AccountDeletionRequestRepository repository;
    private final UserRepository userRepository;

    public AccountDeletionService(AccountDeletionRequestRepository repository,
                                  UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AccountDeletionRequest getLatest(Long userId) {
        return repository.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }

    @Transactional
    public AccountDeletionRequest create(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is already inactive");
        }

        String normalizedReason = reason == null ? "" : reason.trim();
        if (normalizedReason.length() < 10) {
            throw new IllegalArgumentException("Reason must contain at least 10 characters");
        }

        if (repository.existsByUserIdAndStatus(userId, AccountDeletionRequestStatus.PENDING)) {
            return repository.findTopByUserIdOrderByCreatedAtDesc(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Pending deletion request already exists"));
        }

        AccountDeletionRequest req = new AccountDeletionRequest();
        req.setUserId(user.getId());
        req.setRole(user.getRole());
        req.setReason(normalizedReason);
        req.setStatus(AccountDeletionRequestStatus.PENDING);

        return repository.save(req);
    }
}
