package am.ivixhub.api.auth;

import am.ivixhub.api.sms.SmsSender;
import am.ivixhub.users.domain.PasswordRecoveryCode;
import am.ivixhub.users.domain.PasswordRecoveryStatus;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserRole;
import am.ivixhub.users.repository.PasswordRecoveryCodeRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PasswordRecoveryService {

    private static final int ATTEMPTS_LIMIT = 5;

    private final UserRepository userRepository;
    private final PasswordRecoveryCodeRepository passwordRecoveryCodeRepository;
    private final SmsSender smsSender;

    private final SecureRandom random = new SecureRandom();
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public PasswordRecoveryService(UserRepository userRepository,
                                   PasswordRecoveryCodeRepository passwordRecoveryCodeRepository,
                                   SmsSender smsSender) {
        this.userRepository = userRepository;
        this.passwordRecoveryCodeRepository = passwordRecoveryCodeRepository;
        this.smsSender = smsSender;
    }

    @Transactional
    public void requestCode(String phone, UserRole role) {
        UserRole requestedRole = validateSelfServiceRole(role);

        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);

        User user = userRepository.findByPhone(normalizedPhone)
                .filter(User::isPhoneVerified)
                .filter(User::isActive)
                .filter(x -> x.getRole() == requestedRole)
                .orElse(null);

        if (user == null) {
            return;
        }

        cancelActiveCodes(user.getId(), normalizedPhone);

        String code = String.format("%06d", random.nextInt(1_000_000));

        PasswordRecoveryCode recoveryCode = new PasswordRecoveryCode();
        recoveryCode.setUserId(user.getId());
        recoveryCode.setPhone(normalizedPhone);
        recoveryCode.setCodeHash(encoder.encode(code));
        recoveryCode.setStatus(PasswordRecoveryStatus.CREATED);
        recoveryCode.setAttemptsLeft(ATTEMPTS_LIMIT);
        recoveryCode.setExpiresAt(OffsetDateTime.now().plusMinutes(10));

        passwordRecoveryCodeRepository.save(recoveryCode);

        smsSender.send(normalizedPhone, "IviXHub recovery code: " + code);
    }

    @Transactional
    public PasswordRecoveryVerifyResponse verifyCode(String phone, String code) {
        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);

        User user = userRepository.findByPhone(normalizedPhone)
                .filter(User::isPhoneVerified)
                .filter(User::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Recovery is not available for this phone number"));

        PasswordRecoveryCode recoveryCode = passwordRecoveryCodeRepository
                .findTopByUserIdAndPhoneAndStatusOrderByCreatedAtDesc(
                        user.getId(),
                        normalizedPhone,
                        PasswordRecoveryStatus.CREATED
                )
                .orElseThrow(() -> new IllegalArgumentException("No active recovery code"));

        if (OffsetDateTime.now().isAfter(recoveryCode.getExpiresAt())) {
            recoveryCode.setStatus(PasswordRecoveryStatus.EXPIRED);
            passwordRecoveryCodeRepository.save(recoveryCode);
            throw new IllegalArgumentException("Recovery code expired");
        }

        if (recoveryCode.getAttemptsLeft() <= 0) {
            recoveryCode.setStatus(PasswordRecoveryStatus.EXPIRED);
            passwordRecoveryCodeRepository.save(recoveryCode);
            throw new IllegalArgumentException("No attempts left");
        }

        boolean ok = encoder.matches(code, recoveryCode.getCodeHash());
        if (!ok) {
            recoveryCode.setAttemptsLeft(recoveryCode.getAttemptsLeft() - 1);
            if (recoveryCode.getAttemptsLeft() <= 0) {
                recoveryCode.setStatus(PasswordRecoveryStatus.EXPIRED);
            }
            passwordRecoveryCodeRepository.save(recoveryCode);
            throw new IllegalArgumentException("Invalid recovery code");
        }

        String recoveryToken = UUID.randomUUID().toString();

        recoveryCode.setStatus(PasswordRecoveryStatus.VERIFIED);
        recoveryCode.setVerifiedAt(OffsetDateTime.now());
        recoveryCode.setRecoveryTokenHash(encoder.encode(recoveryToken));
        recoveryCode.setRecoveryTokenExpiresAt(OffsetDateTime.now().plusMinutes(15));
        passwordRecoveryCodeRepository.save(recoveryCode);

        return new PasswordRecoveryVerifyResponse(recoveryToken);
    }

    @Transactional
    public void resetPassword(String phone, String recoveryToken, String password) {
        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);

        User user = userRepository.findByPhone(normalizedPhone)
                .filter(User::isPhoneVerified)
                .filter(User::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Recovery is not available for this phone number"));

        PasswordRecoveryCode recoveryCode = passwordRecoveryCodeRepository
                .findTopByUserIdAndPhoneAndStatusOrderByCreatedAtDesc(
                        user.getId(),
                        normalizedPhone,
                        PasswordRecoveryStatus.VERIFIED
                )
                .orElseThrow(() -> new IllegalArgumentException("Recovery verification is required"));

        if (recoveryCode.getRecoveryTokenHash() == null || recoveryCode.getRecoveryTokenExpiresAt() == null) {
            throw new IllegalArgumentException("Recovery verification is required");
        }

        if (OffsetDateTime.now().isAfter(recoveryCode.getRecoveryTokenExpiresAt())) {
            recoveryCode.setStatus(PasswordRecoveryStatus.EXPIRED);
            passwordRecoveryCodeRepository.save(recoveryCode);
            throw new IllegalArgumentException("Recovery session expired");
        }

        if (!encoder.matches(recoveryToken, recoveryCode.getRecoveryTokenHash())) {
            throw new IllegalArgumentException("Invalid recovery token");
        }

        user.setPasswordHash(encoder.encode(password));
        userRepository.save(user);

        recoveryCode.setStatus(PasswordRecoveryStatus.CONSUMED);
        recoveryCode.setConsumedAt(OffsetDateTime.now());
        passwordRecoveryCodeRepository.save(recoveryCode);

        cancelOlderVerifiedCodes(user.getId(), normalizedPhone, recoveryCode.getId());
    }

    private void cancelActiveCodes(Long userId, String phone) {
        List<PasswordRecoveryCode> existingCodes = passwordRecoveryCodeRepository
                .findAllByUserIdAndPhoneAndStatusInOrderByCreatedAtDesc(
                        userId,
                        phone,
                        List.of(PasswordRecoveryStatus.CREATED, PasswordRecoveryStatus.VERIFIED)
                );

        for (PasswordRecoveryCode code : existingCodes) {
            code.setStatus(PasswordRecoveryStatus.CANCELLED);
        }

        if (!existingCodes.isEmpty()) {
            passwordRecoveryCodeRepository.saveAll(existingCodes);
        }
    }

    private void cancelOlderVerifiedCodes(Long userId, String phone, Long currentId) {
        List<PasswordRecoveryCode> existingCodes = passwordRecoveryCodeRepository
                .findAllByUserIdAndPhoneAndStatusInOrderByCreatedAtDesc(
                        userId,
                        phone,
                        List.of(PasswordRecoveryStatus.VERIFIED)
                );

        boolean changed = false;
        for (PasswordRecoveryCode code : existingCodes) {
            if (!code.getId().equals(currentId)) {
                code.setStatus(PasswordRecoveryStatus.CANCELLED);
                changed = true;
            }
        }

        if (changed) {
            passwordRecoveryCodeRepository.saveAll(existingCodes);
        }
    }

    private UserRole validateSelfServiceRole(UserRole role) {
        if (role == null) {
            throw new IllegalArgumentException("Role is required");
        }

        if (role != UserRole.CLIENT && role != UserRole.PSYCHOLOGIST) {
            throw new IllegalArgumentException("Unsupported self-service role");
        }

        return role;
    }

    private void validatePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }

        if (!phone.matches("^\\+[1-9][0-9]{7,14}$")) {
            throw new IllegalArgumentException("Phone must be in international format, for example +374XXXXXXXX");
        }
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return "";
        }
        return phone.replaceAll("[\\s\\-()]", "");
    }
}
