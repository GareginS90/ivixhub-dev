
package am.ivixhub.api.audit;

import am.ivixhub.audit.domain.AuditEvent;
import am.ivixhub.audit.repository.AuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private final AuditEventRepository repo;

    public AuditService(AuditEventRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public void log(Long actorUserId,
                    String action,
                    String targetType,
                    Long targetId,
                    String details,
                    String ip,
                    String userAgent) {

        AuditEvent e = new AuditEvent();
        e.setActorUserId(actorUserId);
        e.setAction(action);
        e.setTargetType(targetType);
        e.setTargetId(targetId);
        e.setDetails(details);
        e.setIp(ip);
        e.setUserAgent(userAgent != null ? userAgent.substring(0, Math.min(userAgent.length(), 300)) : null);

        repo.save(e);
    }

    // удобный метод для фоновых задач (ip/ua отсутствуют)
    @Transactional
    public void logSystem(String action, String targetType, Long targetId, String details) {
        log(null, action, targetType, targetId, details, null, null);
    }
}
