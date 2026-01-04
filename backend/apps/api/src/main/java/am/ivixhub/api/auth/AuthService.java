
package am.ivixhub.api.auth;

import am.ivixhub.api.security.JwtService;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserRole;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        userRepository.findByEmail(req.email()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already registered");
        });

        User user = new User();
        user.setEmail(req.email());
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
        User user = userRepository.findByEmail(req.email())
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
