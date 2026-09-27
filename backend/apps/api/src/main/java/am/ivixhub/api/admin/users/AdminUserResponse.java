package am.ivixhub.api.admin.users;

import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserGender;
import am.ivixhub.users.domain.UserRole;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record AdminUserResponse(
        Long id,
        String email,
        String fullName,
        String username,
        LocalDate birthDate,
        UserGender gender,
        String phone,
        boolean phoneVerified,
        UserRole role,
        boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getUsername(),
                user.getBirthDate(),
                user.getGender(),
                user.getPhone(),
                user.isPhoneVerified(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
