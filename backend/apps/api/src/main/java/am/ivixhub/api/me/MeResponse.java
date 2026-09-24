package am.ivixhub.api.me;

import am.ivixhub.users.domain.UserGender;
import am.ivixhub.users.domain.UserRole;

import java.time.LocalDate;

public record MeResponse(
        Long id,
        String email,
        String fullName,
        String username,
        LocalDate birthDate,
        UserGender gender,
        String phone,
        boolean phoneVerified,
        UserRole role,
        boolean active
) {}
