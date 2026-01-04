package am.ivixhub.users.repository;

import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findAllByRole(UserRole role);
}
