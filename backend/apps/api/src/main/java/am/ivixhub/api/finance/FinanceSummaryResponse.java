package am.ivixhub.api.finance;

public record FinanceSummaryResponse(
        long holdAmountMinor,
        long releasedAmountMinor,
        String currency
) {}
