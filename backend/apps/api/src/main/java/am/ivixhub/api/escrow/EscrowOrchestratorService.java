package am.ivixhub.api.escrow;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.payments.domain.EscrowHold;
import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.payments.repository.EscrowHoldRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class EscrowOrchestratorService {

    private final EscrowHoldRepository escrowHoldRepository;
    private final EscrowProvider escrowProvider;
    private final AuditService auditService;

    public EscrowOrchestratorService(EscrowHoldRepository escrowHoldRepository,
                                     EscrowProvider escrowProvider,
                                     AuditService auditService) {
        this.escrowHoldRepository = escrowHoldRepository;
        this.escrowProvider = escrowProvider;
        this.auditService = auditService;
    }

    /**
     * Called after payment confirmed:
     * - create EscrowHold in our ledger
     * - call provider to create hold
     */
    @Transactional
    public EscrowHold createHold(Long bookingId,
                                 Long psychologistId,
                                 Long clientUserId,
                                 long amountMinor,
                                 String currency,
                                 OffsetDateTime holdUntil) {

        // 1) create ledger row
        EscrowHold hold = new EscrowHold();
        hold.setBookingId(bookingId);
        hold.setPsychologistId(psychologistId);
        hold.setAmountMinor(amountMinor);
        hold.setCurrency(currency);
        hold.setHoldUntil(holdUntil);
        hold.setStatus(EscrowStatus.HOLD);
        hold = escrowHoldRepository.save(hold);

        // 2) call provider (mock for now)
        var res = escrowProvider.createHold(new EscrowProvider.CreateHoldRequest(
                hold.getId(),
                bookingId,
                psychologistId,
                clientUserId,
                amountMinor,
                currency,
                holdUntil
        ));

        // 3) audit
        auditService.log(
                clientUserId,
                "ESCROW_HOLD_CREATED",
                "Booking",
                bookingId,
                "escrowHoldId=" + hold.getId() + " provider=" + res.providerName() + " providerRef=" + res.providerHoldRef(),
                null,
                null
        );

        return hold;
    }

    /**
     * Release escrow if holdUntil passed.
     * Provider call happens here too.
     */
    @Transactional
    public EscrowStatus releaseIfEligible(Long psychologistId, Long bookingId) {
        EscrowHold hold = escrowHoldRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Escrow hold not found"));

        if (!hold.getPsychologistId().equals(psychologistId)) {
            throw new IllegalArgumentException("Not your escrow");
        }

        if (hold.getStatus() != EscrowStatus.HOLD) {
            return hold.getStatus();
        }

        if (OffsetDateTime.now().isBefore(hold.getHoldUntil())) {
            return EscrowStatus.HOLD;
        }

        // call provider release
        var res = escrowProvider.releaseHold(new EscrowProvider.ReleaseHoldRequest(
                hold.getId(),
                hold.getBookingId(),
                hold.getPsychologistId()
        ));

        hold.setStatus(EscrowStatus.RELEASED);
        escrowHoldRepository.save(hold);

        auditService.logSystem(
                "ESCROW_RELEASED",
                "Booking",
                bookingId,
                "escrowHoldId=" + hold.getId() + " provider=" + res.providerName() + " providerRef=" + res.providerHoldRef()
        );

        return EscrowStatus.RELEASED;
    }
}
