package am.ivixhub.api.finance;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.payments.repository.EscrowHoldRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Component
public class EscrowReleaseJob {

    private static final Logger log = LoggerFactory.getLogger(EscrowReleaseJob.class);

    private final EscrowHoldRepository escrowHoldRepository;
    private final AuditService auditService;

    public EscrowReleaseJob(EscrowHoldRepository escrowHoldRepository,
                            AuditService auditService) {
        this.escrowHoldRepository = escrowHoldRepository;
        this.auditService = auditService;
    }

    @Scheduled(fixedDelay = 300_000)
    @Transactional
    public void releaseEligible() {
        var now = OffsetDateTime.now();
        var holds = escrowHoldRepository.findReadyForRelease(EscrowStatus.HOLD, now);

        if (!holds.isEmpty()) {
            log.info("[ESCROW JOB] releasing {} holds at {}", holds.size(), now);
        }

        for (var h : holds) {
            h.setStatus(EscrowStatus.RELEASED);
            escrowHoldRepository.save(h);

            auditService.logSystem(
                    "ESCROW_RELEASED_JOB",
                    "Booking",
                    h.getBookingId(),
                    "psychologistId=" + h.getPsychologistId() + " amountMinor=" + h.getAmountMinor()
            );
        }
    }
}

