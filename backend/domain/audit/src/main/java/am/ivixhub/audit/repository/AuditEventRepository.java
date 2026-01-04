package am.ivixhub.audit.repository;

import am.ivixhub.audit.domain.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {

    List<AuditEvent> findTop200ByOrderByIdDesc();

    List<AuditEvent> findTop200ByActorUserIdOrderByIdDesc(Long actorUserId);

    List<AuditEvent> findTop200ByActionOrderByIdDesc(String action);
}

