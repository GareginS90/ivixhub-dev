package am.ivixhub.users.repository;

import am.ivixhub.users.domain.PasswordRecoveryCode;
import am.ivixhub.users.domain.PasswordRecoveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PasswordRecoveryCodeRepository extends JpaRepository<PasswordRecoveryCode, Long> {

    List<PasswordRecoveryCode> findAllByUserIdAndPhoneAndStatusInOrderByCreatedAtDesc(
            Long userId,
            String phone,
            Collection<PasswordRecoveryStatus> statuses
    );

    Optional<PasswordRecoveryCode> findTopByUserIdAndPhoneAndStatusOrderByCreatedAtDesc(
            Long userId,
            String phone,
            PasswordRecoveryStatus status
    );
}
