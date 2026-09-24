package am.ivixhub.api.me;

import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;

@RestController
public class MeController {

    private final UserRepository userRepository;

    public MeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/me")
    public MeResponse me(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return map(user);
    }

    @PutMapping("/api/me")
    public MeResponse update(Authentication auth, @Valid @RequestBody MeUpdateProfileRequest req) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String normalizedUsername = req.username().trim().toLowerCase();
        String normalizedFullName = req.fullName() == null ? null : req.fullName().trim();
        LocalDate birthDate = req.birthDate();

        if (birthDate.isBefore(LocalDate.of(1940, 1, 1)) || birthDate.isAfter(LocalDate.of(2010, 12, 31))) {
            throw new IllegalArgumentException("Birth date is out of allowed range");
        }

        userRepository.findByUsername(normalizedUsername).ifPresent(existing -> {
            if (!existing.getId().equals(user.getId())) {
                throw new IllegalArgumentException("This username is already taken");
            }
        });

        user.setFullName((normalizedFullName == null || normalizedFullName.isBlank()) ? null : normalizedFullName);
        user.setUsername(normalizedUsername);
        user.setBirthDate(birthDate);
        user.setGender(req.gender());

        User saved = userRepository.save(user);
        return map(saved);
    }

    private MeResponse map(User user) {
        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getUsername(),
                user.getBirthDate(),
                user.getGender(),
                user.getPhone(),
                user.isPhoneVerified(),
                user.getRole(),
                user.isActive()
        );
    }
}
