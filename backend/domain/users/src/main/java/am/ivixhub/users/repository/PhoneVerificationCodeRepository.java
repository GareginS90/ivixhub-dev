package am.ivixhub.users.repository;

import am.ivixhub.users.domain.PhoneVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PhoneVerificationCodeRepository extends JpaRepository<PhoneVerificationCode, Long> {

    Optional<PhoneVerificationCode> findTopByUserIdAndPhoneAndUsedFalseOrderByCreatedAtDesc(Long userId, String phone);
}
