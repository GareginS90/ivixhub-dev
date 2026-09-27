package am.ivixhub.api.admin.users;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserGender;
import am.ivixhub.users.domain.UserRole;
import am.ivixhub.users.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;

    private static final LocalDate MIN_BIRTH_DATE = LocalDate.of(1940, 1, 1);
    private static final LocalDate MAX_BIRTH_DATE = LocalDate.of(2010, 12, 31);

    private final UserRepository userRepository;
    private final AuditService auditService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminUserController(
            UserRepository userRepository,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @GetMapping
    @Transactional
    public AdminUsersPageResponse list(
            Authentication auth,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "role", required = false) UserRole role,
            @RequestParam(name = "active", required = false) Boolean active
    ) {
        Long adminUserId = (Long) auth.getPrincipal();

        int safePage = Math.max(page, 0);
        int safeSize = size <= 0
                ? DEFAULT_PAGE_SIZE
                : Math.min(size, MAX_PAGE_SIZE);

        String normalizedSearch = normalizeSearch(search);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<User> users = normalizedSearch == null
                ? userRepository.findForAdmin(role, active, pageable)
                : userRepository.searchForAdmin(
                        normalizedSearch,
                        role,
                        active,
                        pageable
                );

        Page<AdminUserResponse> result = users.map(AdminUserResponse::from);

        auditService.log(
                adminUserId,
                "ADMIN_USERS_LIST",
                "User",
                null,
                "Admin viewed users list"
                        + "; page=" + safePage
                        + "; size=" + safeSize
                        + "; role=" + role
                        + "; active=" + active
                        + "; search=" + (normalizedSearch == null ? "" : normalizedSearch),
                null,
                null
        );

        return AdminUsersPageResponse.from(result);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public AdminUserResponse create(
            Authentication auth,
            @Valid @RequestBody AdminCreateUserRequest request
    ) {
        Long adminUserId = (Long) auth.getPrincipal();

        String normalizedEmail = request.email().trim().toLowerCase();
        String normalizedUsername = request.username().trim().toLowerCase();
        String normalizedFullName = normalizeOptional(request.fullName());
        String normalizedPhone = normalizeOptional(request.phone());

        validateBirthDate(request.birthDate());

        userRepository.findByEmail(normalizedEmail).ifPresent(existing -> {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This email is already registered"
            );
        });

        userRepository.findByUsername(normalizedUsername).ifPresent(existing -> {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This username is already taken"
            );
        });

        if (normalizedPhone != null) {
            userRepository.findByPhone(normalizedPhone).ifPresent(existing -> {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This phone number is already registered"
                );
            });
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName(normalizedFullName);
        user.setUsername(normalizedUsername);
        user.setBirthDate(request.birthDate());
        user.setGender(
                request.gender() == null
                        ? UserGender.UNSPECIFIED
                        : request.gender()
        );
        user.setPhone(normalizedPhone);
        user.setPhoneVerified(false);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setActive(request.active());

        User saved = userRepository.save(user);

        auditService.log(
                adminUserId,
                "ADMIN_USER_CREATE",
                "User",
                saved.getId(),
                "Admin created user account"
                        + "; role=" + saved.getRole()
                        + "; email=" + saved.getEmail()
                        + "; active=" + saved.isActive(),
                null,
                null
        );

        return AdminUserResponse.from(saved);
    }

    @GetMapping("/{userId}")
    @Transactional
    public AdminUserResponse detail(
            Authentication auth,
            @PathVariable(name = "userId") Long userId
    ) {
        Long adminUserId = (Long) auth.getPrincipal();

        User user = findUser(userId);

        auditService.log(
                adminUserId,
                "ADMIN_USER_VIEW",
                "User",
                user.getId(),
                "Admin viewed user details",
                null,
                null
        );

        return AdminUserResponse.from(user);
    }

    @PostMapping("/{userId}/activate")
    @Transactional
    public AdminUserResponse activate(
            Authentication auth,
            @PathVariable(name = "userId") Long userId
    ) {
        Long adminUserId = (Long) auth.getPrincipal();

        User user = findUser(userId);

        if (!user.isActive()) {
            user.setActive(true);
            user = userRepository.save(user);

            auditService.log(
                    adminUserId,
                    "ADMIN_USER_ACTIVATE",
                    "User",
                    user.getId(),
                    "Admin activated user account"
                            + "; role=" + user.getRole()
                            + "; email=" + user.getEmail(),
                    null,
                    null
            );
        }

        return AdminUserResponse.from(user);
    }

    @PostMapping("/{userId}/deactivate")
    @Transactional
    public AdminUserResponse deactivate(
            Authentication auth,
            @PathVariable(name = "userId") Long userId
    ) {
        Long adminUserId = (Long) auth.getPrincipal();

        if (adminUserId.equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Administrators cannot deactivate their own account"
            );
        }

        User user = findUser(userId);

        if (user.isActive()) {
            user.setActive(false);
            user = userRepository.save(user);

            auditService.log(
                    adminUserId,
                    "ADMIN_USER_DEACTIVATE",
                    "User",
                    user.getId(),
                    "Admin deactivated user account"
                            + "; role=" + user.getRole()
                            + "; email=" + user.getEmail(),
                    null,
                    null
            );
        }

        return AdminUserResponse.from(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private void validateBirthDate(LocalDate birthDate) {
        if (birthDate.isBefore(MIN_BIRTH_DATE)
                || birthDate.isAfter(MAX_BIRTH_DATE)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Birth date is out of allowed range"
            );
        }
    }

    private String normalizeSearch(String search) {
        if (search == null) {
            return null;
        }

        String normalized = search.trim();

        return normalized.isEmpty() ? null : normalized;
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty() ? null : normalized;
    }
}
