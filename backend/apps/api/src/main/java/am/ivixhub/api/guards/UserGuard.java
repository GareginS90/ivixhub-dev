package am.ivixhub.api.guards;

import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class UserGuard {

    private final UserRepository userRepository;

    public UserGuard(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User requirePhoneVerified(Long userId) {
        User user = requireUser(userId);
        if (!user.isPhoneVerified()) {
            throw new IllegalArgumentException("Phone not verified");
        }
        return user;
    }
}
