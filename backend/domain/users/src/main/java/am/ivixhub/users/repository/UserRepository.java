package am.ivixhub.users.repository;

import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByUsername(String username);

    List<User> findAllByRole(UserRole role);

    @Query("""
            select u
            from User u
            where (:role is null or u.role = :role)
              and (:active is null or u.active = :active)
            """)
    Page<User> findForAdmin(
            @Param("role") UserRole role,
            @Param("active") Boolean active,
            Pageable pageable
    );

    @Query("""
            select u
            from User u
            where (:role is null or u.role = :role)
              and (:active is null or u.active = :active)
              and (
                    lower(u.email) like lower(concat('%', :search, '%'))
                    or lower(u.username) like lower(concat('%', :search, '%'))
                    or lower(coalesce(u.fullName, '')) like lower(concat('%', :search, '%'))
                    or lower(coalesce(u.phone, '')) like lower(concat('%', :search, '%'))
                  )
            """)
    Page<User> searchForAdmin(
            @Param("search") String search,
            @Param("role") UserRole role,
            @Param("active") Boolean active,
            Pageable pageable
    );
}
