package am.ivixhub.api.escrow;

import org.springframework.stereotype.Component;

@Component
public class MockEscrowProvider implements EscrowProvider {

    @Override
    public String providerName() {
        return "MOCK_ESCROW";
    }

    @Override
    public CreateHoldResult createHold(CreateHoldRequest req) {
        // Mock provider: always "HOLD"
        return new CreateHoldResult(providerName(), "mock-hold-" + req.escrowHoldId(), "HOLD");
    }

    @Override
    public ReleaseHoldResult releaseHold(ReleaseHoldRequest req) {
        // Mock provider: always "RELEASED"
        return new ReleaseHoldResult(providerName(), "mock-hold-" + req.escrowHoldId(), "RELEASED");
    }
}
