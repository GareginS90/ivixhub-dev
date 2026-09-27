package am.ivixhub.api.auth;

import am.ivixhub.api.security.JwtService;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserGender;
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
        UserGender gender = req.gender() == null ? UserGender.UNSPECIFIED : req.gender();
        UserRole requestedRole = validateSelfServiceRole(req.role());

        if (birthDate.isBefore(LocalDate.of(1940, 1, 1))
                || birthDate.isAfter(LocalDate.of(2010, 12, 31))) {
            throw new IllegalArgumentException("Birth date is out of allowed range");
        }

        userRepository.findByEmail(normalizedEmail).ifPresent(existing -> {
            String existingLabel = roleLabel(existing.getRole());

            if (existing.getRole() != requestedRole) {
                throw new IllegalArgumentException(
                        "This email is already registered for a " + existingLabel + " account"
                );
            }

            throw new IllegalArgumentException("This email is already registered");
        });

        userRepository.findByUsername(normalizedUsername).ifPresent(user -> {
            throw new IllegalArgumentException("This username is already taken");
        });

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName(
                normalizedFullName == null || normalizedFullName.isBlank()
                        ? null
                        : normalizedFullName
        );
        user.setUsername(normalizedUsername);
        user.setBirthDate(birthDate);
        user.setGender(gender);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(requestedRole);
        user.setActive(true);

        User saved = userRepository.save(user);

        return issueTokens(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        UserRole requestedRole = validateSelfServiceRole(req.role());

        User user = userRepository.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (user.getRole() != requestedRole) {
            throw new IllegalArgumentException(
                    "This account is registered as "
                            + roleLabel(user.getRole())
                            + ", not "
                            + roleLabel(requestedRole)
            );
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is disabled");
        }

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse adminLogin(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is disabled");
        }

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public RefreshResponse refresh(RefreshRequest req) {
        User user = resolveRefreshUser(req.refreshToken());

        String newAccess = jwtService.generateAccessToken(user);

        return new RefreshResponse(newAccess);
    }

    @Transactional(readOnly = true)
    public RefreshResponse adminRefresh(RefreshRequest req) {
        User user = resolveRefreshUser(req.refreshToken());

        if (user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("Invalid administrator refresh token");
        }

        String newAccess = jwtService.generateAccessToken(user);

        return new RefreshResponse(newAccess);
    }

    private User resolveRefreshUser(String refreshToken) {
        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        Long userId = jwtService.extractUserId(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is disabled");
        }

        return user;
    }

    private AuthResponse issueTokens(User user) {
        String access = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                access,
                refresh
        );
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

    private String roleLabel(UserRole role) {
        return switch (role) {
            case CLIENT -> "client";
            case PSYCHOLOGIST -> "psychologist";
            case ADMIN -> "admin";
        };
    }
}
