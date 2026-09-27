package am.ivixhub.api.admin.users;

import org.springframework.data.domain.Page;

import java.util.List;

public record AdminUsersPageResponse(
        List<AdminUserResponse> users,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {

    public static AdminUsersPageResponse from(Page<AdminUserResponse> result) {
        return new AdminUsersPageResponse(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isFirst(),
                result.isLast()
        );
    }
}
