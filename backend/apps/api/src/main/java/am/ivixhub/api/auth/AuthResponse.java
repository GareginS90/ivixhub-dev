package am.ivixhub.api.auth;

import am.ivixhub.users.domain.UserRole;

public record AuthResponse(
        Long id,
        String email,
        UserRole role,
        String accessToken,
        String refreshToken
) {}

