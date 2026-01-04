package am.ivixhub.api.ratelimit;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimpleRateLimiter {

    private static class Bucket {
        int tokens;
        long refillAtEpochSec;
        Bucket(int tokens, long refillAtEpochSec) {
            this.tokens = tokens;
            this.refillAtEpochSec = refillAtEpochSec;
        }
    }

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    /**
     * Token-bucket:
     * - capacity: max requests per window
     * - windowSeconds: window size
     */
    public boolean allow(String key, int capacity, int windowSeconds) {
        long now = Instant.now().getEpochSecond();

        Bucket b = buckets.computeIfAbsent(key, k -> new Bucket(capacity, now + windowSeconds));

        synchronized (b) {
            if (now >= b.refillAtEpochSec) {
                b.tokens = capacity;
                b.refillAtEpochSec = now + windowSeconds;
            }
            if (b.tokens <= 0) return false;
            b.tokens--;
            return true;
        }
    }
}
