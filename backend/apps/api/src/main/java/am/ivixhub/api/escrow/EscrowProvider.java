package am.ivixhub.api.escrow;

import java.time.OffsetDateTime;

public interface EscrowProvider {

    record CreateHoldRequest(
            Long escrowHoldId,
            Long bookingId,
            Long psychologistId,
            Long clientUserId,
            long amountMinor,
            String currency,
            OffsetDateTime holdUntil
    ) {}

    record CreateHoldResult(
            String providerName,
            String providerHoldRef,
            String status
    ) {}

    record ReleaseHoldRequest(
            Long escrowHoldId,
            Long bookingId,
            Long psychologistId
    ) {}

    record ReleaseHoldResult(
            String providerName,
            String providerHoldRef,
            String status
    ) {}

    String providerName();

    CreateHoldResult createHold(CreateHoldRequest req);

    ReleaseHoldResult releaseHold(ReleaseHoldRequest req);
}
