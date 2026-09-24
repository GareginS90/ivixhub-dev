package am.ivixhub.api.bookings;

import am.ivixhub.bookings.domain.SessionType;

import java.time.Duration;
import java.util.Locale;

public final class SessionTypeDurations {

    private SessionTypeDurations() {
    }

    public static Duration resolve(SessionType type) {
        if (type == null) {
            throw new IllegalArgumentException("Session type is required");
        }

        String key = type.name().trim().toUpperCase(Locale.ROOT);

        return switch (key) {
            case "COUPLES", "COUPLE", "PAIR" -> Duration.ofMinutes(90);
            case "GROUP", "GROUP_SESSION", "GROUP_THERAPY" -> Duration.ofHours(3);
            case "INDIVIDUAL", "SINGLE", "PERSONAL", "ONE_TO_ONE", "ONE2ONE" -> Duration.ofMinutes(50);
            default -> Duration.ofMinutes(50);
        };
    }
}
