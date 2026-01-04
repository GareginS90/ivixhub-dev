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

        // Генерируем 6-значный код
        String code = String.format("%06d", random.nextInt(1_000_000));

        PhoneVerificationCode pvc = new PhoneVerificationCode();
        pvc.setUserId(user.getId());
        pvc.setPhone(phone);
        pvc.setCodeHash(encoder.encode(code));
        pvc.setAttemptsLeft(5);
        pvc.setExpiresAt(OffsetDateTime.now().plusMinutes(5));

        codeRepository.save(pvc);

        // В реале тут будет SMS провайдер, пока логируем
        smsSender.send(phone, "IviXHub code: " + code);
    }

    @Transactional
    public void verify(Long userId, String phone, String code) {
        PhoneVerificationCode pvc = codeRepository
                .findTopByUserIdAndPhoneAndUsedFalseOrderByCreatedAtDesc(userId, phone)
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

        pvc.setUsed(true);
        codeRepository.save(pvc);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPhone(phone);
        user.setPhoneVerified(true);
        userRepository.save(user);
    }
}
