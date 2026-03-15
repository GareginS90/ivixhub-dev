package am.ivixhub.api.auth;

import am.ivixhub.api.security.JwtService;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserRole;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String normalizedEmail = req.email().trim().toLowerCase();
        String normalizedUsername = req.username().trim().toLowerCase();
        String normalizedFullName = req.fullName() == null ? null : req.fullName().trim();
        LocalDate birthDate = req.birthDate();

        if (birthDate.isBefore(LocalDate.of(1940, 1, 1)) || birthDate.isAfter(LocalDate.of(2010, 12, 31))) {
            throw new IllegalArgumentException("Birth date is out of allowed range");
        }

        userRepository.findByEmail(normalizedEmail).ifPresent(u -> {
            throw new IllegalArgumentException("This email is already registered");
        });

        userRepository.findByUsername(normalizedUsername).ifPresent(u -> {
            throw new IllegalArgumentException("This username is already taken");
        });

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName((normalizedFullName == null || normalizedFullName.isBlank()) ? null : normalizedFullName);
        user.setUsername(normalizedUsername);
        user.setBirthDate(birthDate);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(UserRole.CLIENT);
        user.setActive(true);

        User saved = userRepository.save(user);

        String access = jwtService.generateAccessToken(saved);
        String refresh = jwtService.generateRefreshToken(saved);

        return new AuthResponse(saved.getId(), saved.getEmail(), saved.getRole(), access, refresh);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String access = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole(), access, refresh);
    }

    @Transactional(readOnly = true)
    public RefreshResponse refresh(RefreshRequest req) {
        String refreshToken = req.refreshToken();

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        Long userId = jwtService.extractUserId(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String newAccess = jwtService.generateAccessToken(user);
        return new RefreshResponse(newAccess);
    }
}
