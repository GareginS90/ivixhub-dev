package am.ivixhub.api.phone;

import am.ivixhub.api.sms.SmsSender;
import am.ivixhub.users.domain.PhoneVerificationCode;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.PhoneVerificationCodeRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;

@Service
public class PhoneVerificationService {

    private final UserRepository userRepository;
    private final PhoneVerificationCodeRepository codeRepository;
    private final SmsSender smsSender;

    private final SecureRandom random = new SecureRandom();
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public PhoneVerificationService(UserRepository userRepository,
                                    PhoneVerificationCodeRepository codeRepository,
                                    SmsSender smsSender) {
        this.userRepository = userRepository;
        this.codeRepository = codeRepository;
        this.smsSender = smsSender;
    }

    @Transactional
    public void start(Long userId, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);
        ensurePhoneIsAvailableForUser(user, normalizedPhone);

        String code = String.format("%06d", random.nextInt(1_000_000));

        PhoneVerificationCode pvc = new PhoneVerificationCode();
        pvc.setUserId(user.getId());
        pvc.setPhone(normalizedPhone);
        pvc.setCodeHash(encoder.encode(code));
        pvc.setAttemptsLeft(5);
        pvc.setExpiresAt(OffsetDateTime.now().plusMinutes(5));

        codeRepository.save(pvc);

        smsSender.send(normalizedPhone, "IviXHub code: " + code);
    }

    @Transactional
    public void verify(Long userId, String phone, String code) {
        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);

        PhoneVerificationCode pvc = codeRepository
                .findTopByUserIdAndPhoneAndUsedFalseOrderByCreatedAtDesc(userId, normalizedPhone)
                .orElseThrow(() -> new IllegalArgumentException("No active code"));

        if (pvc.isUsed()) {
            throw new IllegalArgumentException("Code already used");
        }
        if (OffsetDateTime.now().isAfter(pvc.getExpiresAt())) {
            throw new IllegalArgumentException("Code expired");
        }
        if (pvc.getAttemptsLeft() <= 0) {
            throw new IllegalArgumentException("No attempts left");
        }

        boolean ok = encoder.matches(code, pvc.getCodeHash());
        if (!ok) {
            pvc.setAttemptsLeft(pvc.getAttemptsLeft() - 1);
            codeRepository.save(pvc);
            throw new IllegalArgumentException("Invalid code");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ensurePhoneIsAvailableForUser(user, normalizedPhone);

        pvc.setUsed(true);
        codeRepository.save(pvc);

        user.setPhone(normalizedPhone);
        user.setPhoneVerified(true);
        userRepository.save(user);
    }

    private void ensurePhoneIsAvailableForUser(User currentUser, String normalizedPhone) {
        userRepository.findByPhone(normalizedPhone).ifPresent(existing -> {
            if (!existing.getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException(
                        "This phone number is already linked to another account. Please sign in to the existing account or use account recovery."
                );
            }
        });
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
        if (phone == null) return "";
        return phone.replaceAll("[\\s\\-()]", "");
    }
}
