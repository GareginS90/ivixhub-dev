package am.ivixhub.api.me;

import am.ivixhub.users.domain.UserRole;

public record MeResponse(
        Long id,
        String email,
        String phone,
        boolean phoneVerified,
        UserRole role,
        boolean active
) {}
