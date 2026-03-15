package am.ivixhub.api.accountdeletion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account-deletion")
public class AccountDeletionController {

    private final AccountDeletionService service;

    public AccountDeletionController(AccountDeletionService service) {
        this.service = service;
    }

    public record CreateDeletionRequest(
            @NotBlank
            @Size(min = 10, max = 1000)
            String reason
    ) {}

    public record AccountDeletionResponse(
            Long id,
            String role,
            String reason,
            String status,
            String createdAt,
            String reviewedAt,
            Long reviewedByUserId,
            String decisionNote
    ) {
        public static AccountDeletionResponse from(AccountDeletionRequest r) {
            if (r == null) return null;
            return new AccountDeletionResponse(
                    r.getId(),
                    r.getRole().name(),
                    r.getReason(),
                    r.getStatus().name(),
                    r.getCreatedAt() == null ? null : r.getCreatedAt().toString(),
                    r.getReviewedAt() == null ? null : r.getReviewedAt().toString(),
                    r.getReviewedByUserId(),
                    r.getDecisionNote()
            );
        }
    }

    @GetMapping("/me")
    public AccountDeletionResponse me(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return AccountDeletionResponse.from(service.getLatest(userId));
    }

    @PostMapping("/request")
    public AccountDeletionResponse requestDeletion(Authentication auth,
                                                   @RequestBody CreateDeletionRequest req) {
        Long userId = (Long) auth.getPrincipal();
        return AccountDeletionResponse.from(service.create(userId, req.reason()));
    }
}
