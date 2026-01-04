package am.ivixhub.api.admin.audit;

import am.ivixhub.audit.domain.AuditEvent;
import am.ivixhub.audit.repository.AuditEventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
public class AdminAuditController {

    private final AuditEventRepository repo;

    public AdminAuditController(AuditEventRepository repo) {
        this.repo = repo;
    }

    /**
     * GET /api/admin/audit
     * GET /api/admin/audit?actorUserId=9
     * GET /api/admin/audit?action=PAYMENT_PAID_MOCK
     */
    @GetMapping
    public List<AuditEvent> list(@RequestParam(value = "actorUserId", required = false) Long actorUserId,
                                 @RequestParam(value = "action", required = false) String action) {

        if (actorUserId != null) {
            return repo.findTop200ByActorUserIdOrderByIdDesc(actorUserId);
        }

        if (action != null && !action.isBlank()) {
            return repo.findTop200ByActionOrderByIdDesc(action);
        }

        return repo.findTop200ByOrderByIdDesc();
    }
}
